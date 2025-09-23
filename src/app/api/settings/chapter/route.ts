import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Chapter from "@/models/Chapter";

// ➡️ Add Chapter
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const chapter = await Chapter.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: chapter });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All Chapter
export async function GET() {
  try {
    await dbConnect();
    const chapters = await Chapter.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: chapters });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
