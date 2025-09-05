// import { NextResponse } from "next/server";
// import { dbConnect } from "@/lib/db";
// import Course from "@/models/Course";



// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   await dbConnect();
//   const course = await Course.findById(params.id);
//   return NextResponse.json({ success: true, data: course });
// }

// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   await dbConnect();
//   const body = await req.json();
//   const course = await Course.findByIdAndUpdate(params.id, body, {
//     new: true,
//   });
//   return NextResponse.json({ success: true, data: course });
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   await dbConnect();
//   await Course.findByIdAndDelete(params.id);
//   return NextResponse.json({ success: true, message: "Course deleted" });
// }
/*
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Course from "@/models/Course";
import Video from "@/models/Video";
import { Types } from "mongoose";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid course id" }, { status: 400 });
    }

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    // Cascade delete videos first
    await Video.deleteMany({ courseId: id });

    // Then delete course
    await Course.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Course & videos deleted" });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "Server error" }, { status: 500 });
  }
}
*/
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Course from "@/models/Course";
import Video from "@/models/Video";
import { Types } from "mongoose";

export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = context.params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid course id" },
        { status: 400 }
      );
    }

    const course = await Course.findById(id).lean();
    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    // इस course के सारे videos fetch करो
    const videos = await Video.find({ courseId: id })
      .sort({ orderIndex: 1 }) // ordered playlist
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        ...course,
        videos,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = context.params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid course id" },
        { status: 400 }
      );
    }

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    // Cascade delete: पहले videos हटाओ
    await Video.deleteMany({ courseId: id });

    // फिर course delete करो
    await Course.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Course & videos deleted",
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e.message || "Server error" },
      { status: 500 }
    );
  }
}

/*
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Course from "@/models/Course";
import Video from "@/models/Video";
import { Types } from "mongoose";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid course id" },
        { status: 400 }
      );
    }

    const course = await Course.findById(id).lean();
    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    // 🟢 Fetch related videos
    const videos = await Video.find({ courseId: id })
      .sort({ orderIndex: 1 }) // ordered playlist
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        ...course,
        videos, // attach videos array
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e.message || "Server error" },
      { status: 500 }
    );
  }
}
*/