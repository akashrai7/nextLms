import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Training_language from "@/models/Training_language";

// ➡️ Update
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
  export async function PUT(_req: Request, { params }: any) {
  try {
    await dbConnect();
    const body = await _req.json();
    const training_language = await Training_language.findByIdAndUpdate(params.id, body, { new: true });

    if (!training_language) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: training_language });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Delete
// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
export async function DELETE(_req: Request, { params }: any) {
try {
    await dbConnect();
    const training_language = await Training_language.findByIdAndDelete(params.id);

    if (!training_language) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
