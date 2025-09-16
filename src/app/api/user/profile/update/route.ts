import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { jwtVerify } from "jose";
import { promises as fs } from "fs";
import path from "path";

export async function PUT(req: Request) {
  try {
    // ✅ JWT से userId निकालना
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
    const userId = payload.sub as string;

    await dbConnect();

    const body = await req.json();

    // ✅ Restricted fields
    const disallowedFields = ["email", "firstName", "lastName"];
    disallowedFields.forEach((field) => delete body[field]);

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 });
    }

    // ✅ Track changes
    const updates: any[] = [];
for (const key of Object.keys(body)) {
  const userDoc = user as any; // 👈 cast to any for dynamic indexing
  if (userDoc[key] !== body[key]) {
    updates.push({
      field: key,
      oldValue: userDoc[key],
      newValue: body[key],
      updatedAt: new Date(),
    });
    userDoc[key] = body[key]; // नया value assign
  }
}

    // ✅ Profile Image Handling (अगर नया image है)
    if (body.photo) {
      // image को server पर save करना (simple example: public/uploads में)
      const buffer = Buffer.from(body.photo, "base64");
      const fileName = `${userId}-${Date.now()}.png`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);
      await fs.writeFile(filePath, buffer);

      updates.push({
        field: "photo",
        oldValue: user.photo,
        newValue: `/uploads/${fileName}`,
        updatedAt: new Date()
      });
      user.photo = `/uploads/${fileName}`;
    }

    // ✅ केवल last 3 records रखना
    user.updatesHistory = [...updates, ...(user.updatesHistory || [])].slice(0, 3);

    await user.save();

    return NextResponse.json({ ok: true, message: "Profile updated", data: user });
  } catch (err: any) {
    console.error("PROFILE_UPDATE_ERROR", err);
    return NextResponse.json({ ok: false, message: "Update failed" }, { status: 500 });
  }
}
