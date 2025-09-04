/*import { NextResponse } from "next/server"; 
import { jwtVerify } from "jose";
import { dbConnect } from "@/lib/db";
import User, { IUser } from "@/models/User"; // ensure IUser exported from model

export async function GET(req: Request) {
  try {
    const token = (req.headers.get("cookie") || "")
      .split("; ")
      .find((c) => c.startsWith("auth="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET!;
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(token, encoder.encode(secret));

    await dbConnect();

    // Payload से userId निकालो
    const userId = payload.sub as string;

    // ✅ Properly type annotate result
    const user = await User.findById<IUser>(userId).lean<IUser>();

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        registrationId: user.registrationId,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error("ME_ERROR", err);
    return NextResponse.json(
      { ok: false, message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
*/
import { NextResponse } from "next/server"; 
import { jwtVerify } from "jose";
import { dbConnect } from "@/lib/db";
import User, { IUser } from "@/models/User";

export async function GET(req: Request) {
  try {
    const token = (req.headers.get("cookie") || "")
      .split("; ")
      .find((c) => c.startsWith("auth="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET!;
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(token, encoder.encode(secret));

    await dbConnect();

    const userId = payload.sub as string;

    // ✅ Explicitly type cast
    const user = (await User.findById(userId).lean()) as IUser | null;

    if (!user) {
      return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      data: {
        registrationId: user.registrationId,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
      },
    });
  } catch (err) {
    console.error("ME_ERROR", err);
    return NextResponse.json({ ok: false, message: "Failed to fetch user" }, { status: 500 });
  }
}
