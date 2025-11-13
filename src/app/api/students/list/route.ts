// import { NextRequest, NextResponse } from "next/server";
// import { dbConnect } from "@/lib/db";
// import User from "@/models/User";

// export async function GET(req: NextRequest) {
//   await dbConnect();

//   try {
//     const { search, class: classId, session, page = "1", limit = "10" } =
//       Object.fromEntries(req.nextUrl.searchParams);

//     const pageNum = parseInt(page as string, 10) || 1;
//     const limitNum = parseInt(limit as string, 10) || 10;

//     const query: any = { role: "student" };

//     if (classId) query.currentClass = classId;
//     if (session) query.academicSession = session;

//     if (search) {
//       query.$or = [
//         { firstName: { $regex: search, $options: "i" } },
//         { lastName: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { mobile: { $regex: search, $options: "i" } },
//         { registrationId: { $regex: search, $options: "i" } },
//       ];
//     }

//     const total = await User.countDocuments(query);
//     const students = await User.find(query)
//       .populate("currentClass", "name")
//       .populate("academicSession", "name")
//       .populate("nationality", "name")
//       .skip((pageNum - 1) * limitNum)
//       .limit(limitNum)
//       .lean();

//     return NextResponse.json({
//       success: true,
//       data: students,
//       pagination: {
//         page: pageNum,
//         limit: limitNum,
//         total,
//         pages: Math.ceil(total / limitNum),
//       },
//     });
//   } catch (err) {
//     console.error("Error fetching students:", err);
//     return NextResponse.json(
//       { success: false, message: "Server error while fetching students" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { search, class: cls, session, page = "1", limit = "10" } = Object.fromEntries(
      new URL(req.url).searchParams
    );

    const query: any = { role: "student" };

    if (cls) query.currentClass = cls;
    if (session) query.academicSession = session;

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const students = await User.find(query)
      .populate({ path: "currentClass", select: "name", strictPopulate: false })
      .populate({ path: "academicSession", select: "name", strictPopulate: false })
      .populate({ path: "nationality", select: "name", strictPopulate: false })
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: students,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("Error fetching students:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
