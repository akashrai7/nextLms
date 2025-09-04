import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Training_mode from "@/models/Training_mode";

// ➡️ Update
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await req.json();
    const training_mode = await Training_mode.findByIdAndUpdate(params.id, body, { new: true });

    if (!training_mode) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: training_mode });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Delete
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const training_mode = await Training_mode.findByIdAndDelete(params.id);

    if (!training_mode) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
