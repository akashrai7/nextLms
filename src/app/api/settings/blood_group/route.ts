import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Blood_group from "@/models/Blood_group";

// ➡️ Add Blood_group
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const blood_group = await Blood_group.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: blood_group });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All Blood_group
export async function GET() {
  try {
    await dbConnect();
    const blood_groups = await Blood_group.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: blood_groups });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
