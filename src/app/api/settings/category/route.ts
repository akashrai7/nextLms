import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Category from "@/models/Category";

// ➡️ Add Category
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const category = await Category.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: category });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All Category
export async function GET() {
  try {
    await dbConnect();
    const categorys = await Category.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: categorys });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
