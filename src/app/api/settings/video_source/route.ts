import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Video_source from "@/models/Video_source";

// ➡️ Add Video_source
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const video_source = await Video_source.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: video_source });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All Video_source
export async function GET() {
  try {
    await dbConnect();
    const video_sources = await Video_source.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: video_sources });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
