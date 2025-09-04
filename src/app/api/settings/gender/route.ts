import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Gender from "@/models/Gender";

// ➡️ Add Gender
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const gender = await Gender.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: gender });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All Gender
export async function GET() {
  try {
    await dbConnect();
    const genders = await Gender.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: genders });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
