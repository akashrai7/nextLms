// import { NextResponse } from "next/server";
// import { dbConnect } from "@/lib/db";
// import Course from "@/models/Course";
// import Video from "@/models/Video";
// import { Types } from "mongoose";

// // GET handler
// export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
//   try {
//     await dbConnect();
//     const { id } = await context.params;

//     if (!Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, message: "Invalid course id" },
//         { status: 400 }
//       );
//     }

//     const course = await Course.findById(id).lean();
//     if (!course) {
//       return NextResponse.json(
//         { success: false, message: "Course not found" },
//         { status: 404 }
//       );
//     }

//     const videos = await Video.find({ courseId: id })
//       .sort({ orderIndex: 1 })
//       .lean();

//     return NextResponse.json({
//       success: true,
//       data: { ...course, videos },
//     });
//   } catch (e: any) {
//     return NextResponse.json(
//       { success: false, message: e.message || "Server error" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE handler
// export async function DELETE(_req: Request, { params }: any) {
//   try {
//     await dbConnect();
//     const { id } = params;

//     if (!Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, message: "Invalid course id" },
//         { status: 400 }
//       );
//     }

//     const course = await Course.findById(id);
//     if (!course) {
//       return NextResponse.json(
//         { success: false, message: "Course not found" },
//         { status: 404 }
//       );
//     }

//     await Video.deleteMany({ courseId: id });
//     await Course.findByIdAndDelete(id);

//     return NextResponse.json({
//       success: true,
//       message: "Course & videos deleted",
//     });
//   } catch (e: any) {
//     return NextResponse.json(
//       { success: false, message: e.message || "Server error" },
//       { status: 500 }
//     );
//   }
// }
// app/api/course/[id]/route.ts
/*
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Course from "@/models/Course";
import { getServerSession } from "next-auth/next";


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const session: any = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const data = await req.json();

    // पुराना course data लाओ
    const oldCourse: any = await Course.findById(params.id);
    if (!oldCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // बदले हुए fields निकालो
    const changes: { field: string; oldValue: any; newValue: any }[] = [];
    Object.keys(data).forEach((key) => {
      const oldValue = oldCourse[key]?.toString?.() ?? oldCourse[key];
      const newValue = data[key];

      if (oldValue !== newValue) {
        changes.push({ field: key, oldValue, newValue });
      }
    });

    // अगर changes mile hain to log karo
    if (changes.length > 0) {
      oldCourse.updateLogs.push({
        updatedBy: userId,
        updatedAt: new Date(),
        changes,
      });

      // sirf last 3 records rakho
      if (oldCourse.updateLogs.length > 3) {
        oldCourse.updateLogs = oldCourse.updateLogs.slice(-3);
      }
    }

    // naye data se course update karo
    Object.assign(oldCourse, data);
    await oldCourse.save();

    return NextResponse.json(
      { message: "Course updated successfully", course: oldCourse },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
*/
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Course from "@/models/Course";
import jwt from "jsonwebtoken";

// GET single course by id
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/courses/[id]
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  await dbConnect();
const { id } = await context.params;

  let userId: string;

  try {
    // 🔹 Auth check (JWT from header)
    const authHeader = req.headers.get("authorization");  
  //  console.log("Authorization Header:", authHeader);
    if (!authHeader) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Malformed Authorization header" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
 //   console.log("Decoded Token:", decoded);
    userId = decoded.id; // अब सही से assign होगा
  } catch (err) {
  //  console.error("JWT verify error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    // 🔹 Parse incoming form data
    const formData = await req.formData();
    const updates: any = {};
    formData.forEach((value, key) => {
      if (key === "courseType") {
        if (!updates.courseType) updates.courseType = [];
        updates.courseType.push(value.toString());
      } else {
        updates[key] = value;
      }
    });

    // 🔹 Find old course
    // const oldCourse = await Course.findById(params.id);
    const oldCourse = await Course.findById(id);
    if (!oldCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 🔹 Track changes
    const changes: { field: string; oldValue: any; newValue: any }[] = [];
    Object.keys(updates).forEach((key) => {
      if (oldCourse[key]?.toString() !== updates[key]?.toString()) {
        changes.push({
          field: key,
          oldValue: oldCourse[key],
          newValue: updates[key],
        });
      }
    });

    if (changes.length > 0) {
      oldCourse.updateHistory.push({
      updatedBy: userId,
      updatedAt: new Date(),
      changes,
    });

  if (oldCourse.updateHistory.length > 3) {
    oldCourse.updateHistory.shift(); // max 3 hi rakhega
  }
}


    // 🔹 Apply updates
    Object.assign(oldCourse, updates);
    await oldCourse.save();

    return NextResponse.json(
      { message: "Course updated successfully", data: oldCourse },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Update course error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
