import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Category from "@/models/Category";

// ➡️ Update
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
export async function PUT(_req: Request, { params }: any) {
try {
    await dbConnect();
    const body = await _req.json();
    const category = await Category.findByIdAndUpdate(params.id, body, { new: true });

    if (!category) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: category });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Delete
// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  export async function DELETE(_req: Request, { params }: any) {
try {
    await dbConnect();
    const category = await Category.findByIdAndDelete(params.id);

    if (!category) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
