import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Institute_type from "@/models/Institute_type";

// ➡️ Update
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await req.json();
    const institute_type = await Institute_type.findByIdAndUpdate(params.id, body, { new: true });

    if (!institute_type) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: institute_type });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Delete
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const institute_type = await Institute_type.findByIdAndDelete(params.id);

    if (!institute_type) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
