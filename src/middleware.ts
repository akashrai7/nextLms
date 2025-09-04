/*
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Allowed routes by role
const roleRoutes: Record<string, string[]> = {
  admin: ["/admin"],
  teacher: ["/teacher"],
  student: ["/student"],
};

async function verifyJWT(token: string, secret: string) {
  const encoder = new TextEncoder();
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    return payload as { role?: string; sub?: string; rid?: string };
  } catch (err) {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes (login/register)
  if (
    pathname.startsWith("/authentication") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/authentication/login", req.url));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("❌ Missing JWT_SECRET in env");
    return NextResponse.redirect(new URL("/authentication/login", req.url));
  }

  const payload = await verifyJWT(token, secret);
  if (!payload) {
    return NextResponse.redirect(new URL("/authentication/login", req.url));
  }

  const userRole = payload.role;

  // Role-based route protection
  for (const [role, routes] of Object.entries(roleRoutes)) {
    if (routes.some((r) => pathname.startsWith(r))) {
      if (userRole !== role) {
        return NextResponse.redirect(new URL("/authentication/login", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
*/

// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Allowed routes by role
const roleRoutes: Record<string, string[]> = {
  admin: ["/admin"],
  teacher: ["/teacher"],
  student: ["/student"],
};

// Default dashboard per role
const roleDashboard: Record<string, string> = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
};

async function verifyJWT(token: string, secret: string) {
  const encoder = new TextEncoder();
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    return payload as { role?: string; sub?: string; rid?: string };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes (login/register)
  if (
    pathname.startsWith("/authentication") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/authentication/sign-in", req.url));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("❌ Missing JWT_SECRET in env");
    return NextResponse.redirect(new URL("/authentication/sign-in", req.url));
  }

  const payload = await verifyJWT(token, secret);
  if (!payload) {
    return NextResponse.redirect(new URL("/authentication/sign-in", req.url));
  }

  const userRole = payload.role;

  // Role-based route protection
  for (const [role, routes] of Object.entries(roleRoutes)) {
    if (routes.some((r) => pathname.startsWith(r))) {
      if (userRole !== role) {
        // ❌ Mismatch → redirect user to their own dashboard
        const redirectPath = roleDashboard[userRole as string] || "/authentication/sign-in";
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
