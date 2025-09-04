import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Video from "@/models/Video";


// GET all videos
export async function GET() {
  await dbConnect();
  const videos = await Video.find().populate("courseId", "title");
  return NextResponse.json({ ok: true, data: videos });
}

// POST create new video
export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const video = await Video.create(body);
    return NextResponse.json({ ok: true, data: video });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 400 });
  }
}
