/*
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { generateRegistrationId } from "@/lib/id";

const RegistrationSchema = z
  .object({
    role: z.enum(["teacher", "student"]).default("student"),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    dob: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date"),
    email: z.string().email(),
    mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile"),
    password: z
      .string()
      .min(8, "Min 8 chars")
      .regex(/[A-Z]/, "At least 1 uppercase")
      .regex(/[a-z]/, "At least 1 lowercase")
      .regex(/\d/, "At least 1 number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(req: Request) {
  try {
    // Database connection check
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json(
        { ok: false, message: "Database connection failed" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const parsed = RegistrationSchema.safeParse(body);
    if (!parsed.success) {
  console.log(parsed.error.flatten().fieldErrors); 
  return NextResponse.json(
    { ok: false, errors: parsed.error.flatten().fieldErrors },
    { status: 400 }
  );
}

    const { role, firstName, lastName, dob, email, mobile, password } = parsed.data;

    // Check if email/mobile already exists
    const existing = await User.findOne({ $or: [{ email }, { mobile }] }).lean();
    if (existing) {
      return NextResponse.json(
        { ok: false, message: "Email or Mobile already exists" },
        { status: 409 }
      );
    }

    const registrationId = await generateRegistrationId(role);
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      registrationId,
      role,
      firstName,
      lastName,
      dob: new Date(dob),
      email,
      mobile,
      password: hash,
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Registration successful",
        data: {
          registrationId: user.registrationId,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("REGISTER_ERROR", err);
    return NextResponse.json(
      { ok: false, message: err?.message || "Registration failed" },
      { status: 500 }
    );
  }
}
*/

import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { generateRegistrationId } from "@/lib/id";

// ✅ Optimized Zod Schema
const RegistrationSchema = z
  .object({
    role: z.enum(["teacher", "student"]).default("student"),
    firstName: z.string().min(2, "First name too short").max(50),
    lastName: z.string().min(2, "Last name too short").max(50),
    dob: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date"),
    email: z.string().email("Invalid email"),
    mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile"),
    password: z
      .string()
      .min(8, "Min 8 chars")
      .regex(/[A-Z]/, "At least 1 uppercase")
      .regex(/[a-z]/, "At least 1 lowercase")
      .regex(/\d/, "At least 1 number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(req: Request) {
  try {
    // ✅ Step 1: Parse & validate body first (Fast fail)
    const body = await req.json();
    const parsed = RegistrationSchema.safeParse(body);

    if (!parsed.success) {
      // Flatten errors into simple object
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { role, firstName, lastName, dob, email, mobile, password } = parsed.data;

    // ✅ Step 2: Connect to DB (only if validation passed)
    await dbConnect();

    // ✅ Step 3: Check if email/mobile already exists
    const existing = await User.findOne({ $or: [{ email }, { mobile }] }).lean();
    if (existing) {
      return NextResponse.json(
        { ok: false, message: "Email or Mobile already exists" },
        { status: 409 }
      );
    }

    // ✅ Step 4: Generate registration ID
    const registrationId = await generateRegistrationId(role);

    // ✅ Step 5: Hash password (faster in dev mode)
    const saltRounds = process.env.NODE_ENV === "production" ? 10 : 8;
    const hash = await bcrypt.hash(password, saltRounds);

    // ✅ Step 6: Create user
    const user = await User.create({
      registrationId,
      role,
      firstName,
      lastName,
      dob: new Date(dob),
      email,
      mobile,
      password: hash,
    });

    // ✅ Step 7: Success response
    return NextResponse.json(
      {
        ok: true,
        message: "Registration successful",
        data: {
          registrationId: user.registrationId,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("REGISTER_ERROR", err);
    return NextResponse.json(
      { ok: false, message: err?.message || "Registration failed" },
      { status: 500 }
    );
  }
}
