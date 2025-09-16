import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import State from "@/models/State";

// ➡️ Add State
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const state = await State.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: state });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All State
export async function GET() {
  try {
    await dbConnect();
    const states = await State.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: states });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
