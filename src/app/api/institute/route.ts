import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Institute from "@/models/Institute";
import { parseForm } from "@/lib/fileUpload";

// ✅ Required for formidable
export const config = {
  api: { bodyParser: false },
};

// CREATE
export async function POST(req: Request) {
  await dbConnect();
  try {
    const { fields, files } = await parseForm(req as any);

    // ✅ Normalize fields
    const normalizedFields = normalizeFields(fields);

    // Files
    const schoolRegFile = files.schoolRegCertificate?.[0]?.newFilename;
    const panFile = files.institutePAN?.[0]?.newFilename;

    // Create institute
    const institute = await Institute.create({
      ...normalizedFields,
      computerCount: normalizedFields.computerCount
        ? Number(normalizedFields.computerCount)
        : 0,
      schoolRegCertificate: schoolRegFile,
      institutePAN: panFile,
    });

    return NextResponse.json({ success: true, data: institute });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// 🔹 Normalization helper
function normalizeFields(fields: any) {
  const normalized: any = {};
  Object.keys(fields).forEach((key) => {
    const value = fields[key];
    normalized[key] = Array.isArray(value) ? value[0] : value;
  });
  return normalized;
}

// GET ALL
export async function GET() {
  await dbConnect();
  try {
    const institutes = await Institute.find()
      .populate("instituteType")
      .populate("affiliationBoard")
      .populate("state")
      .populate("district");

    return NextResponse.json({ success: true, data: institutes });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

