import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Afiliation_board from "@/models/Affiliation_board";

// ➡️ Add Afiliation_board
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, createdBy } = await req.json();

    const afiliation_board = await Afiliation_board.create({ name, createdBy });
    return NextResponse.json({ ok: true, data: afiliation_board });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

// ➡️ Get All Afiliation_board
export async function GET() {
  try {
    await dbConnect();
    const afiliation_boards = await Afiliation_board.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, data: afiliation_boards });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}
