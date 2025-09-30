import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Institute from "@/models/Institute";
import { parseForm } from "@/lib/fileUpload";

export const config = {
  api: { bodyParser: false }, // important for formidable
};

// ✅ CREATE
export async function POST(req: Request) {
  await dbConnect();
  try {
    const { fields, files } = await parseForm(req);

    // File paths
    const schoolRegFile = files.schoolRegCertificate?.newFilename;
    const panFile = files.institutePAN?.newFilename;

    const institute = await Institute.create({
      ...fields,
      schoolRegCertificate: schoolRegFile,
      institutePAN: panFile,
    });

    return NextResponse.json({ success: true, data: institute });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ✅ GET ALL
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
