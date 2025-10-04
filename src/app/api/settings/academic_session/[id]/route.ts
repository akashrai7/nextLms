import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Academic_session from "@/models/Academic_session";

// ➡️ Update
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
export async function PUT(_req: Request, { params }: any) {
  try {
    await dbConnect();
    const body = await _req.json();
    const academic_session = await Academic_session.findByIdAndUpdate(params.id, body, { new: true });

    if (!academic_session) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: academic_session });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Delete
// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
export async function DELETE(_req: Request, { params }: any) {
  try {
    await dbConnect();
    const academic_session = await Academic_session.findByIdAndDelete(params.id);

    if (!academic_session) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
