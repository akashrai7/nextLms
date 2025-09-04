import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Institute_type from "@/models/Institute_type";

// ➡️ Add Institute_type
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const institute_type = await Institute_type.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: institute_type });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All institute_type
export async function GET() {
  try {
    await dbConnect();
    const institute_types = await Institute_type.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: institute_types });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
