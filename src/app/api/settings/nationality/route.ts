import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Nationality from "@/models/Nationality";

// ➡️ Add nationality
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const nationality = await Nationality.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: nationality });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All nationality
export async function GET() {
  try {
    await dbConnect();
    const nationalities = await Nationality.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: nationalities });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
