// import { NextResponse } from "next/server";
// import { dbConnect } from "@/lib/db";
// import Course from "@/models/Course";

// // GET all courses
// export async function GET() {
//   await dbConnect();
//   const courses = await Course.find().sort({ createdAt: -1 });
//   return NextResponse.json({ success: true, data: courses });
// }

// // POST new course
// export async function POST(req: Request) {
//   await dbConnect();
//   const body = await req.json();

//   try {
//     const course = await Course.create(body);
//     return NextResponse.json({ success: true, data: course });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 400 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Course from "@/models/Course";
import fs from "fs";
import formidable from "formidable";
import { IncomingForm } from "formidable";
import { IncomingMessage } from "http";
import { Readable } from "stream";

// Disable Next.js body parsing (important for formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Helper: Normalize Formidable fields (convert ["value"] → "value")
function normalizeFields(fields: formidable.Fields) {
  const normalized: Record<string, any> = {};
  for (const key in fields) {
    const value = fields[key];
    if (Array.isArray(value)) {
      normalized[key] = value[0]; // sirf first value lo
    } else {
      normalized[key] = value;
    }
  }
  return normalized;
}

// ✅ Helper: Convert NextRequest to Node.js IncomingMessage
async function toNodeRequest(req: Request): Promise<IncomingMessage> {
  const body = Buffer.from(await req.arrayBuffer());
  const stream = Readable.from(body);
  const nodeReq = Object.assign(stream, {
    headers: Object.fromEntries(req.headers),
    method: req.method,
    url: req.url,
  });
  return nodeReq as unknown as IncomingMessage;
}

export async function POST(req: Request) {
  await dbConnect();
  
  try {
    const nodeReq = await toNodeRequest(req);
    const form = new IncomingForm({ multiples: true });

    const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
      (resolve, reject) => {
        form.parse(nodeReq, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      }
    );

    // 🔑 Normalize fields
    const data = normalizeFields(fields);

    // ✅ Validation (text fields)
    if (!data.title) {
      return NextResponse.json({ success: false, message: "Course title is required" }, { status: 400 });
    }
    if (!data.language) {
      return NextResponse.json({ success: false, message: "Language is required" }, { status: 400 });
    }
    if (!data.instructor) {
      return NextResponse.json({ success: false, message: "Instructor is required" }, { status: 400 });
    }
    if (!data.courseType) {
      return NextResponse.json({ success: false, message: "Course type is required" }, { status: 400 });
    }
    if (!data.certificate) {
      return NextResponse.json({ success: false, message: "Certificate (YES/NO) is required" }, { status: 400 });
    }
    

    // ✅ Validation (images size check)
    const thumbnail: any = (files as any).thumbnail?.[0];
    if (!thumbnail) {
      return NextResponse.json({ success: false, message: "Thumbnail image is required" }, { status: 400 });
    }
    if (thumbnail.size > 500 * 1024) {
      return NextResponse.json({ success: false, message: "Thumbnail must be under 500KB" }, { status: 400 });
    }

    const coverPhoto: any = (files as any).coverPhoto?.[0];
    if (!coverPhoto) {
      return NextResponse.json({ success: false, message: "Cover photo is required" }, { status: 400 });
    }
    if (coverPhoto.size > 500 * 1024) {
      return NextResponse.json({ success: false, message: "Cover photo must be under 500KB" }, { status: 400 });
    }

    const certificateBase: any = (files as any).certificateBase?.[0];
    if (!certificateBase) {
      return NextResponse.json({ success: false, message: "Certificate base image is required" }, { status: 400 });
    }
    if (certificateBase.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "Certificate base must be under 5MB" }, { status: 400 });
    }

    // ✅ File save path (example: /public/uploads)
    const uploadPath = "public/uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const saveFile = (file: any) => {
      const filePath = `${uploadPath}/${Date.now()}-${file.originalFilename}`;
      fs.copyFileSync(file.filepath, filePath);
      return filePath.replace("public", "");
    };

    const thumbnailPath = saveFile(thumbnail);
    const coverPhotoPath = saveFile(coverPhoto);
    const certificateBasePath = saveFile(certificateBase);

    // ✅ Save course in DB (normalize fields use karo!)
    const newCourse = await Course.create({
      courseType: Array.isArray(data.courseType) ? data.courseType : [data.courseType],
      language: data.language,
      instructor: data.instructor,
      title: data.title,
      thumbnail: thumbnailPath,
      coverPhoto: coverPhotoPath,
      certificateBase: certificateBasePath,
      demoVideo: data.demoVideo,
      videoSource: data.videoSource,
      courseLevel: data.courseLevel,
      summary: data.summary,
      description: data.description,
      certificate: data.certificate,
    });

    return NextResponse.json(
      { success: true, message: "Course created successfully", course: newCourse },
      { status: 201 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
