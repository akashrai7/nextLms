import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Blood_group from "@/models/Blood_group";

// ➡️ Update 
//export async function PUT(req: Request, { params }: { params: { id: string } }) {
export async function PUT(_req: Request, { params }: any) {
  try {
    await dbConnect();
    const body = await _req.json();
    const blood_group = await Blood_group.findByIdAndUpdate(params.id, body, { new: true });

    if (!blood_group) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: blood_group });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Delete
//export async function DELETE(req: Request, { params }: { params: { id: string } }) {
export async function DELETE(_req: Request, { params }: any) {
  try {
    await dbConnect();
    const blood_group = await Blood_group.findByIdAndDelete(params.id);

    if (!blood_group) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
