/*import mongoose, { Schema, Document, Model } from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/db";

// ---------- Config ----------
const MAX_ATTEMPTS = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000; // 15 min
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 1000;

// In-memory stores
const rateMap = new Map<string, { count: number; resetAt: number }>();
const lockMap = new Map<string, { attempts: number; lockedUntil: number }>();

// ---------- User Model ----------
export interface IUser extends Document {
  registrationId: string;
  role: "admin" | "teacher" | "student";
  firstName: string;
  lastName: string;
  dob: Date;
  email: string;
  mobile: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  registrationId: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "teacher", "student"], default: "student" },
  firstName: String,
  lastName: String,
  dob: Date,
  email: { type: String, unique: true },
  mobile: { type: String, unique: true },
  password: String,
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// ---------- Helpers ----------
const LoginSchema = z.object({
  identifier: z.string().min(3, "Invalid identifier"), // email or mobile
  password: z.string().min(1, "Password required"),
});

function getClientIP(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "0.0.0.0";
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function touchRateLimit(key: string) {
  const now = Date.now();
  const slot = rateMap.get(key);
  if (!slot || now > slot.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true };
  }
  if (slot.count >= RATE_LIMIT) {
    return { allowed: false };
  }
  slot.count += 1;
  return { allowed: true };
}

function getLock(key: string) {
  const now = Date.now();
  const entry = lockMap.get(key);
  if (!entry) return { locked: false };
  if (entry.lockedUntil && now < entry.lockedUntil) {
    return { locked: true };
  }
  if (now > entry.lockedUntil) lockMap.delete(key);
  return { locked: false };
}

function failAttempt(key: string) {
  const now = Date.now();
  const entry = lockMap.get(key);
  if (!entry) {
    lockMap.set(key, { attempts: 1, lockedUntil: 0 });
    return;
  }
  const attempts = (entry.attempts || 0) + 1;
  if (attempts >= MAX_ATTEMPTS) {
    lockMap.set(key, { attempts, lockedUntil: now + LOCK_WINDOW_MS });
  } else {
    lockMap.set(key, { attempts, lockedUntil: 0 });
  }
}

function resetAttempts(key: string) {
  lockMap.delete(key);
}

function setAuthCookie(res: NextResponse, payload: any) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  const token = jwt.sign(payload, secret, { expiresIn: "7d" });

  res.cookies.set("auth", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

// ---------- Route ----------
export async function POST(req: Request) {
  try {
    const ip = getClientIP(req);

    // 1) Rate limit
    const rate = touchRateLimit(`login:${ip}`);
    if (!rate.allowed) {
      return NextResponse.json(
        { ok: false, message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 2) Parse body
    const json = await req.json();
    const parsed = LoginSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { identifier, password } = parsed.data;

    // 3) Lock check
    const lockKey = `lock:${identifier}:${ip}`;
    const lock = getLock(lockKey);
    if (lock.locked) {
      return NextResponse.json(
        { ok: false, message: "Account temporarily locked. Try again later." },
        { status: 423 }
      );
    }

    // 4) DB connect
    await dbConnect();

    // 5) Find user by email OR mobile
    const query = isEmail(identifier)
      ? { email: identifier.toLowerCase().trim() }
      : { mobile: identifier.trim() };

    const user = await User.findOne(query).lean();
    if (!user) {
      return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
    }

    // 6) Compare password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      failAttempt(lockKey);
      return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
    }

    // 7) Success
    resetAttempts(lockKey);

    const res = NextResponse.json({
      ok: true,
      message: "Welcome",
      data: {
        registrationId: user.registrationId,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

    setAuthCookie(res, {
      sub: String(user._id),
      role: user.role,
      rid: user.registrationId,
    });

    return res;
  } catch (err: any) {
    console.error("LOGIN_ERROR", err);
    return NextResponse.json(
      { ok: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
*/

import mongoose, { Schema, Document, Model } from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { SignJWT } from "jose";

// ---------- Config ----------
const MAX_ATTEMPTS = 5;           // ब्रूट-फोर्स रोकने के लिए
const LOCK_WINDOW_MS = 15 * 60 * 1000; // 15 मिनट
const RATE_LIMIT = 10;            // 10 requests
const RATE_WINDOW_MS = 60 * 1000; // प्रति 60 सेकंड

// In-memory stores (server instance scoped)
const rateMap = new Map<string, { count: number; resetAt: number }>();
const lockMap = new Map<string, { attempts: number; lockedUntil: number }>();

// ---------- User Model ----------
export interface IUser extends Document {
  registrationId: string;
  role: "admin" | "teacher" | "student";
  firstName: string;
  lastName: string;
  dob: Date;
  email: string;
  mobile: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  registrationId: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "teacher", "student"], default: "student" },
  firstName: String,
  lastName: String,
  dob: Date,
  email: { type: String, unique: true },
  mobile: { type: String, unique: true },
  password: String,
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);


// ---------- Validation ----------
const LoginSchema = z.object({
  identifier: z.string().min(3, "Invalid identifier"), // email or mobile
  password: z.string().min(1, "Password required"),
  // captcha अभी disable कर रहे हैं localhost के लिए
  // captchaToken: z.string().min(10, "Captcha required"),
  // provider: z.enum(["google", "hcaptcha"]).optional().default("google"),
});

// ---------- Helpers ----------
function getClientIP(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "0.0.0.0";
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function touchRateLimit(key: string) {
  const now = Date.now();
  const slot = rateMap.get(key);
  if (!slot || now > slot.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true };
  }
  if (slot.count >= RATE_LIMIT) {
    return { allowed: false };
  }
  slot.count += 1;
  return { allowed: true };
}

function getLock(key: string) {
  const now = Date.now();
  const entry = lockMap.get(key);
  if (!entry) return { locked: false };
  if (entry.lockedUntil && now < entry.lockedUntil) {
    return { locked: true };
  }
  if (now > entry.lockedUntil) lockMap.delete(key);
  return { locked: false };
}

function failAttempt(key: string) {
  const now = Date.now();
  const entry = lockMap.get(key);
  if (!entry) {
    lockMap.set(key, { attempts: 1, lockedUntil: 0 });
    return;
  }
  const attempts = (entry.attempts || 0) + 1;
  if (attempts >= MAX_ATTEMPTS) {
    lockMap.set(key, { attempts, lockedUntil: now + LOCK_WINDOW_MS });
  } else {
    lockMap.set(key, { attempts, lockedUntil: 0 });
  }
}

function resetAttempts(key: string) {
  lockMap.delete(key);
}

async function setAuthCookie(res: NextResponse, payload: any) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(secret));

  res.cookies.set("auth", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

// ---------- Route ----------
export async function POST(req: Request) {
  try {
    // 1) Rate limit
    const ip = getClientIP(req);
    const rate = touchRateLimit(`login:${ip}`);
    if (!rate.allowed) {
      return NextResponse.json(
        { ok: false, message: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    // 2) Parse body
    const json = await req.json();
    const parsed = LoginSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { identifier, password } = parsed.data;

    // 3) Lock check
    const lockKey = `lock:${identifier}:${ip}`;
    const lock = getLock(lockKey);
    if (lock.locked) {
      return NextResponse.json(
        { ok: false, message: "Account temporarily locked. Try again later." },
        { status: 423 }
      );
    }

    // 4) DB connect
    await dbConnect();

    // 5) Find user
    const query = isEmail(identifier)
      ? { email: identifier.toLowerCase().trim() }
      : { mobile: identifier.trim() };

    const user = await User.findOne(query).lean();
    if (!user || !user.password) {
      failAttempt(lockKey);
      return NextResponse.json(
        { ok: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 6) Password check
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      failAttempt(lockKey);
      return NextResponse.json(
        { ok: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 7) Success
    resetAttempts(lockKey);

    const res = NextResponse.json({
      ok: true,
      message: "Login successful",
      data: {
        registrationId: user.registrationId,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

    await setAuthCookie(res, {
      sub: String(user._id),
      role: user.role,
      rid: user.registrationId,
    });

    return res;
  } catch (err: any) {
    console.error("LOGIN_ERROR", err);
    return NextResponse.json(
      { ok: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
