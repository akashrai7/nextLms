import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Video from "@/models/Video";



// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   await dbConnect();
//   const video = await Video.findById(params.id);
//   return NextResponse.json({ success: true, data: video });
// }

// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   await dbConnect();
//   const body = await req.json();
//   const video = await Video.findByIdAndUpdate(params.id, body, {
//     new: true,
//   });
//   return NextResponse.json({ success: true, data: video });
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   await dbConnect();
//   await Video.findByIdAndDelete(params.id);
//   return NextResponse.json({ success: true, message: "Video deleted" });
// }
import Course from "@/models/Course";

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
export async function DELETE(_req: Request, { params }: any) {
  await dbConnect();

  try {
    const courseId = params.id;

    // पहले videos हटाओ
    await Video.deleteMany({ courseId });

    // फिर course हटाओ
    await Course.findByIdAndDelete(courseId);

    return NextResponse.json({ ok: true, message: "Course and its videos deleted" });
  } catch (error) {
    console.error("Cascade delete error:", error);
    return NextResponse.json({ ok: false, error: "Failed to delete course" }, { status: 500 });
  }
}