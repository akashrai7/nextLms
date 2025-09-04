import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Current_class from "@/models/Current_class";

// ➡️ Add Current class
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const current_class = await Current_class.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: current_class });
  } catch (err: any) {

    return NextResponse.json({ ok: false, message: err.message }, { status: 5000 });
  }
}

// ➡️ Get All current class
export async function GET() {
  try {
    await dbConnect();
    const current_classs = await Current_class.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: current_classs });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
