import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Section from "@/models/Section";

// ➡️ Update
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
export async function PUT(_req: Request, { params }: any) {
try {
    await dbConnect();
    const body = await _req.json();
    const section = await Section.findByIdAndUpdate(params.id, body, { new: true });

    if (!section) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: section });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Delete
// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
export async function DELETE(_req: Request, { params }: any) {  
try {
    await dbConnect();
    const section = await Section.findByIdAndDelete(params.id);

    if (!section) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
