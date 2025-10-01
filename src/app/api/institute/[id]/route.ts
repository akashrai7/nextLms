import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Institute from "@/models/Institute";
import { parseForm } from "@/lib/fileUpload";

// ✅ VIEW ONE
export async function GET(req: NextRequest, context: any) {
  await dbConnect();
  try {
    const params = await context.params; // ✅ Await params
    const { id } = params;
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
function normalizeFields(fields: any) {
  const normalized: any = {};
  Object.keys(fields).forEach((key) => {
    const value = fields[key];
    normalized[key] = Array.isArray(value) ? value[0] : value;
  });
  return normalized;
}

export async function PUT(req: NextRequest, context: any) {
  await dbConnect();
  try {
    const params = await context.params; // ✅ Await params
    const { id } = params;

    const { fields, files } = await parseForm(req);
    const updateData: any = normalizeFields(fields);

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
export async function DELETE(req: NextRequest, context: any) {
  await dbConnect();
  try {
    const params = await context.params; // ✅ Await params
    const { id } = params;
    const institute = await Institute.findByIdAndDelete(id);

    if (!institute) {
      return NextResponse.json({ success: false, message: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
