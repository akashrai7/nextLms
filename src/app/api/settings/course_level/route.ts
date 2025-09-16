import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Course_level from "@/models/Course_level";

// ➡️ Add Course_level
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const course_level = await Course_level.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: course_level });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All Course_level
export async function GET() {
  try {
    await dbConnect();
    const course_levels = await Course_level.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: course_levels });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
