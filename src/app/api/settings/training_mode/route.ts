import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Training_mode from "@/models/Training_mode";

// ➡️ Add training_mode
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const training_mode = await Training_mode.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: training_mode });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All training_mode
export async function GET() {
  try {
    await dbConnect();
    const training_modes = await Training_mode.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: training_modes });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
