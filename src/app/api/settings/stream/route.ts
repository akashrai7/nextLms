import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Stream from "@/models/Stream";

// ➡️ Add Stream
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const stream = await Stream.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: stream });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All Stream
export async function GET() {
  try {
    await dbConnect();
    const streams = await Stream.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: streams });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
