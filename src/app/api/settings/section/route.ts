import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Section from "@/models/Section";

// ➡️ Add Section
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const section = await Section.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: section });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All Section
export async function GET() {
  try {
    await dbConnect();
    const sections = await Section.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: sections });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
