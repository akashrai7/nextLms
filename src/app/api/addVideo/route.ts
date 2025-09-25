import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Video from "@/models/Video";
import path from "path";
import { promises as fs } from "fs";


// Utility: Save uploaded file to /public/uploads
async function saveFile(file: File, folder: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, buffer);
  return `/uploads/${folder}/${fileName}`;
}

//POST handle to add videos
export async function POST(req: Request) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const videos: any[] = [];

    // extract videos dynamically
    const map: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      const match = key.match(/^videos\[(\d+)\]\[(.+)\]$/);
      if (!match) continue;

      const idx = parseInt(match[1]);
      const field = match[2];

      if (!map[idx]) map[idx] = {};

      if (value instanceof File) {
        // file handling
        if (field === "thumbnail") {
          map[idx][field] = await saveFile(value, "thumbnails");
        } else if (field === "videoFile") {
          map[idx][field] = await saveFile(value, "videos");
        }
      } else {
        map[idx][field] = value.toString();
      }
    }

    // Push to array
    Object.values(map).forEach((v: any) => {
      videos.push({
        course: formData.get("courseId"),
        chapter: v.chapter,
        title: v.title,
        description: v.description,
        thumbnail: v.thumbnail,
        videoUrl: v.videoFile,
      });
    });

    // Save to DB
    const inserted = await Video.insertMany(videos);

    return NextResponse.json({ ok: true, data: inserted }, { status: 201 });
  } catch (err: any) {
    console.error("Video Upload Error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}


// GET handle to fetch videos by courseId
export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { ok: false, message: "courseId is required" },
        { status: 400 }
      );
    }

    const videos = await Video.find({ course: courseId })
      .populate("chapter", "name") // chapter ka sirf name field
      .sort({ createdAt: 1 });

    return NextResponse.json({ ok: true, data: videos }, { status: 200 });
  } catch (err: any) {
    console.error("Video Fetch Error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
