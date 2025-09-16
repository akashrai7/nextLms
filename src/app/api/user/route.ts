import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";


// ➡️ Get All User
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: users });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
