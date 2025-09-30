import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Institute from "@/models/Institute";
import { parseForm } from "@/lib/fileUpload";

// ✅ VIEW ONE
export async function GET(req: Request, context: any) {
  await dbConnect();
  try {
    const { id } = context.params; // context.params se id le
    const institute = await Institute.findById(id);

    if (!institute) {
      return NextResponse.json({ success: false, message: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: institute });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


// ✅ UPDATE
export async function GET(req: Request, context: any) {
  await dbConnect();
  try {
    const { fields, files } = await parseForm(req);

    const updateData: any = { ...fields };

    if (files.schoolRegCertificate) {
      updateData.schoolRegCertificate = files.schoolRegCertificate.newFilename;
    }
    if (files.institutePAN) {
      updateData.institutePAN = files.institutePAN.newFilename;
    }

    const institute = await Institute.findByIdAndUpdate(id, updateData, { new: true });

    if (!institute) {
      return NextResponse.json({ success: false, message: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: institute });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ✅ DELETE
export async function GET(req: Request, context: any) {
  await dbConnect();
  try {
     const institute = await Institute.findById(id);

    if (!institute) {
      return NextResponse.json({ success: false, message: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
