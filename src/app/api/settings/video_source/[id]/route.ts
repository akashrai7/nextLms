import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Video_source from "@/models/Video_source";

// ➡️ Update
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
export async function PUT(_req: Request, { params }: any) {
  try {
    await dbConnect();
    const body = await _req.json();
    const video_source = await Video_source.findByIdAndUpdate(params.id, body, { new: true });

    if (!video_source) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: video_source });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Delete
// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
export async function DELETE(_req: Request, { params }: any) {
try {
    await dbConnect();
    const video_source = await Video_source.findByIdAndDelete(params.id);

    if (!video_source) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
