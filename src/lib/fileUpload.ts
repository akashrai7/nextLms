import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

export const uploadDir = path.join(process.cwd(), "public", "uploads");

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const parseForm = (req: any): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 200 * 1024, // 200 KB
      multiples: false,
    });

    form.on("fileBegin", (_name, file) => {
      const ext = path.extname(file.originalFilename || "");
      const safeName = `${Date.now()}-${file.originalFilename}`
        .replace(/\s+/g, "_")
        .toLowerCase();
      file.filepath = path.join(uploadDir, safeName);
      file.newFilename = safeName;
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};
