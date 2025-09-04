import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Current_class from "@/models/Current_class";

// ➡️ Update
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await req.json();
    const current_class = await Current_class.findByIdAndUpdate(params.id, body, { new: true });

    if (!current_class) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: current_class });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Delete
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const current_class = await Current_class.findByIdAndDelete(params.id);

    if (!current_class) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
