import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Academic_session from "@/models/Academic_session";

// ➡️ Add Academic_session
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const academic_session = await Academic_session.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: academic_session });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All academic_session
export async function GET() {
  try {
    await dbConnect();
    const academic_sessions = await Academic_session.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: academic_sessions });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
