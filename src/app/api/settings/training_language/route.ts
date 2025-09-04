import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Training_language from "@/models/Training_language";

// ➡️ Add Training_mode
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const training_mode = await Training_language.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: training_mode });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All Training_language
export async function GET() {
  try {
    await dbConnect();
    const training_language = await Training_language.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: training_language });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
