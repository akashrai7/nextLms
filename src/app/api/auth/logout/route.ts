/*import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true, message: "Logged out successfully" });

  // ✅ Auth cookie remove
  res.cookies.set("auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // तुरंत expire
  });

  return res;
}
*/

// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  
  const response = NextResponse.json({
    ok: true,
    message: "Logged out successfully",
  });

  response.cookies.set("auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax",
    path: "/", 
    expires: new Date(0), 
  });

  return response;
}
