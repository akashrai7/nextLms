import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Course from "@/models/Course";

// GET all courses
export async function GET() {
  await dbConnect();
  const courses = await Course.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: courses });
}

// POST new course
export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();

  try {
    const course = await Course.create(body);
    return NextResponse.json({ success: true, data: course });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
