import { IncomingForm } from "formidable";
import { NextRequest } from "next/server";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import { IncomingMessage } from "http";

export const uploadDir = path.join(process.cwd(), "public", "uploads");

// Ensure uploads dir exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function parseForm(req: NextRequest): Promise<{ fields: any; files: any }> {
  return new Promise(async (resolve, reject) => {
    try {
      // Body ko buffer me convert karo
      const arrayBuffer = await req.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Buffer se ek Readable stream banao
      const stream = Readable.from(buffer);

      // Fake IncomingMessage create karo
      const fakeReq = Object.assign(stream, {
        headers: Object.fromEntries(req.headers),
        method: req.method,
        url: req.url,
      }) as unknown as IncomingMessage;

      const form = new IncomingForm({
        multiples: true,
        keepExtensions: true,
        maxFileSize: 200 * 1024, // 200 KB
        uploadDir,
      });

      form.parse(fakeReq, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    } catch (error) {
      reject(error);
    }
  });
}
