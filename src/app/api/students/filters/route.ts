// import { NextResponse } from "next/server";
// import User from "@/models/User";
// import { dbConnect } from "@/lib/db";
// import Academic_session from "@/models/Academic_session"; // jaha master tables store hote hain
// import Current_class from "@/models/Current_class";

// export async function GET() {
//   await dbConnect();

//   try {
//     const classes = await Current_class.find({ type: "current_class" }).select("_id name");
//     const sessions = await Academic_session.find({ type: "academic_session" }).select("_id name");

//     return NextResponse.json({
//       success: true,
//       classes,
//       sessions,
//     });
//   } catch (err) {
//     console.error("Filters fetch error:", err);
//     return NextResponse.json({ success: false, message: "Error fetching filters" }, { status: 500 });
//   }
// }
// src/app/api/students/filters/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Current_class from "@/models/Current_class";
import Academic_session from "@/models/Academic_session";

export async function GET() {
  await dbConnect();

  try {
    // Get unique class and session IDs from users (only student role)
    const classIds = await User.distinct("currentClass", { role: "student" });
    const sessionIds = await User.distinct("academicSession", { role: "student" });

    // Fetch actual class and session documents with names
    const classes = await Current_class.find({ _id: { $in: classIds } })
      .select("_id name")
      .lean();

    const sessions = await Academic_session.find({ _id: { $in: sessionIds } })
      .select("_id name")
      .lean();

    console.log("🔹 Filter Classes:", classes);
    console.log("🔹 Filter Sessions:", sessions);

    return NextResponse.json({
      success: true,
      classes,
      sessions,
    });
  } catch (err) {
    console.error("Error in filters API:", err);
    return NextResponse.json(
      { success: false, message: "Failed to load filter options." },
      { status: 500 }
    );
  }
}
