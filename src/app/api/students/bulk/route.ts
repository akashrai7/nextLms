import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Student from "@/models/User";
import * as XLSX from "xlsx";
import fs from "fs";
import os from "os";
import path from "path";
import { generateRegistrationId } from "@/lib/id";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Generate password from name + DOB
function genPassword(firstName: string, dob: Date) {
  const fn = (firstName || "").trim().slice(0, 2);
  const dd = String(dob.getDate()).padStart(2, "0");
  const mm = String(dob.getMonth() + 1).padStart(2, "0");
  const yyyy = String(dob.getFullYear());
  return `${fn}${dd}${mm}${yyyy}`;
}

// Parse Excel into rows
async function parseExcelToRows(fileBlob: Blob) {
  const arrayBuffer = await fileBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Directly read buffer
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  return rows;
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const mastersRaw = formData.get("masters")?.toString() ?? "{}";
    let masters: any = {};
    try {
      masters = JSON.parse(mastersRaw);
    } catch {
      masters = {};
    }

    const duplicateHandling = (formData.get("duplicateHandling")?.toString() || "skip") as "skip" | "update";

    if (!file)
      return NextResponse.json(
        { success: false, message: "No file uploaded." },
        { status: 400 }
      );

    const excelRows = await parseExcelToRows(file);

    const summary = { created: 0, updated: 0, skipped: 0, failed: 0 };
    const errorRows: any[] = [];
    const skippedRows: any[] = [];

    for (let i = 0; i < excelRows.length; i++) {
      const row = excelRows[i];
      const rowNum = i + 2; // header is row 1
      try {
        const firstName = String(row["First Name"] ?? "").trim();
        const lastName = String(row["Last Name"] ?? "").trim();
        const email = String(row["Email"] ?? "").trim();
        const mobile = String(row["Mobile"] ?? "").trim();
        const dobRaw = row["DOB"];
        const dob = dobRaw instanceof Date ? dobRaw : new Date(dobRaw);

        // basic validation
        const errors: string[] = [];
        if (!firstName) errors.push("First Name missing");
        if (!lastName) errors.push("Last Name missing");
        if (!email) errors.push("Email missing");
        if (!mobile) errors.push("Mobile missing");
        if (!dob || isNaN(dob.getTime())) errors.push("Invalid DOB");

        if (errors.length) {
          summary.failed++;
          errorRows.push({
            row: rowNum,
            firstName,
            lastName,
            email,
            mobile,
            dobRaw,
            errors,
          });
          continue;
        }

        const password = genPassword(firstName, dob);

        const existing = await Student.findOne({
          $or: [{ email }, { mobile }],
        });

        if (existing) {
          if (duplicateHandling === "skip") {
            summary.skipped++;
            skippedRows.push({
              row: rowNum,
              firstName,
              lastName,
              email,
              mobile,
              dobRaw,
              reason: "Duplicate — skipped",
            });
            continue;
          } else if (duplicateHandling === "update") {
            existing.firstName = firstName;
            existing.lastName = lastName;
            existing.dob = dob;
            existing.password = password;

            // ✅ safe defaults for master fields
            existing.currentClass = masters.currentClass ?? existing.currentClass ?? "";
            existing.stream = masters.stream ?? existing.stream ?? "";
            existing.section = masters.section ?? existing.section ?? "";
            existing.academicSession = masters.academicSession ?? existing.academicSession ?? "";
            existing.nationality = masters.nationality ?? existing.nationality ?? "";
            existing.country = "India";
            existing.role = "student";

            await existing.save();
            summary.updated++;
            continue;
          }
        }

        // 🔹 Registration ID
        const registrationId = await generateRegistrationId();

        // create new student
        const student = new Student({
          firstName,
          lastName,
          email,
          mobile,
          dob,
          password,

          // ✅ safe defaults
          currentClass: masters.currentClass ?? "",
          stream: masters.stream ?? "",
          section: masters.section ?? "",
          academicSession: masters.academicSession ?? "",
          nationality: masters.nationality ?? "",
          country: "India",
          role: "student",

          registrationId,
          updatesHistory: [],
        });

        await student.save();
        summary.created++;
      } catch (rowErr) {
        console.error("Row error:", rowErr);
        summary.failed++;
        errorRows.push({
          row: rowNum,
          ...row,
          errors: ["Server error saving row"],
        });
      }
    }

    return NextResponse.json({
      success: true,
      summary,
      errorRows,
      skippedRows,
    });
  } catch (err) {
    console.error("Bulk upload error:", err);
    return NextResponse.json(
      { success: false, message: "Server error during bulk upload." },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { dbConnect } from "@/lib/db";
// import * as XLSX from "xlsx";
// import bcrypt from "bcryptjs";

// import User from "@/models/User";
// import { generateRegistrationId } from "@/lib/id";

// export const runtime = "nodejs"; // Vercel deploy safety

// export async function POST(req: Request) {
//   try {
//     await dbConnect();

//     // ✅ File read
//     const formData = await req.formData();
//     const file = formData.get("file") as File;
//     const masters = JSON.parse(formData.get("masters") as string);

//     if (!file) {
//       return NextResponse.json(
//         { success: false, message: "No file uploaded" },
//         { status: 400 }
//       );
//     }

//     // ✅ Parse CSV/XLSX
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const workbook = XLSX.read(buffer, { type: "buffer" });
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows: any[] = XLSX.utils.sheet_to_json(sheet);

//     let successCount = 0;
//     let errorRows: any[] = [];

//     for (let i = 0; i < rows.length; i++) {
//       const row = rows[i];
//       const errors: string[] = [];

//       const firstName = row["First Name"]?.trim();
//       const lastName = row["Last Name"]?.trim();
//       const email = row["Email"]?.trim();
//       const mobile = row["Mobile"]?.toString().trim();
//       const dobRaw = row["DOB"];

//       // 🔹 Validation
//       if (!firstName) errors.push("First Name missing");
//       if (!lastName) errors.push("Last Name missing");

//       if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
//         errors.push("Invalid email");
//       } else {
//         const exists = await User.findOne({ email });
//         if (exists) errors.push("Email already exists");
//       }

//       if (!mobile || !/^\d{10}$/.test(mobile)) {
//         errors.push("Invalid mobile");
//       }

//       let dob: Date | null = null;
//       if (dobRaw) {
//         dob = new Date(dobRaw);
//         if (isNaN(dob.getTime())) errors.push("Invalid DOB format");
//       } else {
//         errors.push("DOB missing");
//       }

//       if (errors.length > 0) {
//         errorRows.push({ row: i + 2, errors }); // +2 bcoz Excel header + 1-index
//         continue;
//       }

//       // 🔹 Auto Password
//       const fname = firstName.toLowerCase().slice(0, 2);
//       const dobStr = dob
//         ? `${dob.getDate().toString().padStart(2, "0")}${(dob.getMonth() + 1)
//             .toString()
//             .padStart(2, "0")}${dob.getFullYear()}`
//         : "";
//       const plainPassword = fname + dobStr;
//       const hashedPassword = await bcrypt.hash(plainPassword, 10);

//       // 🔹 Registration ID
//       const registrationId = await generateRegistrationId();

//       // 🔹 Save Student
//       await User.create({
//         firstName,
//         lastName,
//         dob,
//         email,
//         mobile,
//         password: hashedPassword,
//         role: "student",
//         registrationId,
//         ...masters, // currentClass, stream, section, academicSession etc.
//       });

//       successCount++;
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Bulk import completed",
//       successCount,
//       errorRows,
//     });
//   } catch (error: any) {
//     console.error("Bulk upload error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

/*
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import * as XLSX from "xlsx";
import { generateRegistrationId } from "@/lib/id";

export const POST = async (req: NextRequest) => {
  await dbConnect();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const mastersRaw = formData.get("masters") as string;
    const duplicateHandling = (formData.get("duplicateHandling") as string) || "skip";
    const preview = formData.get("preview") === "true";

    if (!file) return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    if (!mastersRaw) return NextResponse.json({ success: false, message: "Masters not selected" }, { status: 400 });

    const masters = JSON.parse(mastersRaw);

    // Read file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
    if (!workbook.SheetNames.length) return NextResponse.json({ success: false, message: "No sheets found in file" }, { status: 400 });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const expectedHeaders = ["First Name", "Last Name", "Email", "Mobile", "DOB"];
    const sheetHeaders = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] as string[] | undefined;
    const missingHeaders = expectedHeaders.filter(h => !(sheetHeaders ?? []).map(s => String(s).trim()).includes(h));
    if (missingHeaders.length) return NextResponse.json({ success: false, message: `Missing columns: ${missingHeaders.join(", ")}` }, { status: 400 });

    // Prepare arrays
    const errorRows: any[] = [];
    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (let idx = 0; idx < rows.length; idx++) {
      const r = rows[idx];
      const rowNum = idx + 2; // Excel row number
      const firstName = String(r["First Name"] ?? "").trim();
      const lastName = String(r["Last Name"] ?? "").trim();
      const email = String(r["Email"] ?? "").trim();
      const mobile = String(r["Mobile"] ?? "").trim();
      const dobRaw = r["DOB"];
      const errors: string[] = [];

      if (!firstName) errors.push("First Name missing");
      if (!lastName) errors.push("Last Name missing");
      if (!email) errors.push("Email missing");
      else if (!/^\S+@\S+\.\S+$/.test(email)) errors.push("Invalid email format");
      if (!mobile) errors.push("Mobile missing");
      else if (!/^\d{10}$/.test(mobile)) errors.push("Mobile must be 10 digits");

      let dob: Date | null = null;
      if (dobRaw instanceof Date) dob = dobRaw;
      else if (typeof dobRaw === "number") dob = new Date(Math.round((dobRaw - 25569) * 86400 * 1000));
      else if (typeof dobRaw === "string") {
        const dmy = dobRaw.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
        if (dmy) dob = new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
        else dob = new Date(dobRaw);
        if (isNaN(dob.getTime())) dob = null;
      }
      if (!dob) errors.push("Invalid DOB");
      else if (dob.getTime() > new Date().getTime()) errors.push("DOB cannot be future");

      if (errors.length > 0) {
        errorRows.push({ row: rowNum, errors, firstName, lastName, email, mobile, dobRaw });
        continue;
      }

      // ✅ Generate password at top level, dob guaranteed not null here
      const fnPart = firstName.slice(0, 2);
      const dd = String(dob!.getDate()).padStart(2, "0");
      const mm = String(dob!.getMonth() + 1).padStart(2, "0");
      const yyyy = String(dob!.getFullYear());
      const password = `${fnPart}${dd}${mm}${yyyy}`;

      if (preview) continue; // skip DB write

      // Check existing
      const existing = await User.findOne({ $or: [{ email }, { mobile }] });
      if (existing) {
        if (duplicateHandling === "skip") {
          skippedCount++;
          continue;
        } else if (duplicateHandling === "update") {
          existing.firstName = firstName;
          existing.lastName = lastName;
          existing.dob = dob!;
          existing.password = password;
          existing.currentClass = masters.currentClass;
          existing.stream = masters.stream;
          existing.section = masters.section;
          existing.academicSession = masters.academicSession;
          existing.nationality = masters.nationality;
          existing.country = "India";
          existing.role = "student";
          await existing.save();
          updatedCount++;
          continue;
        }
      }

      // 🔹 Registration ID
       const registrationId = await generateRegistrationId();
      // create new
      const newUser = new User({
        firstName,
        lastName,
        dob: dob!,
        email,
        mobile,
        password,
        currentClass: masters.currentClass,
        stream: masters.stream,
        section: masters.section,
        academicSession: masters.academicSession,
        nationality: masters.nationality,
        country: "India",
        role: "student",
        registrationId,
        updatesHistory: [],
      });

      await newUser.save();
      createdCount++;
    }

    return NextResponse.json({
      success: true,
      summary: { created: createdCount, updated: updatedCount, skipped: skippedCount, failed: errorRows.length },
      errorRows,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
};
*/

/*2

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Student from "@/models/User";
import * as XLSX from "xlsx";
import { generateRegistrationId } from "@/lib/id";

// Parse Excel from uploaded File
async function parseExcel(file: File) {
  // Convert File -> Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

function genPassword(firstName: string, dob: Date) {
  const fn = (firstName || "").trim().slice(0, 2);
  const dd = String(dob.getDate()).padStart(2, "0");
  const mm = String(dob.getMonth() + 1).padStart(2, "0");
  const yyyy = String(dob.getFullYear());
  return `${fn}${dd}${mm}${yyyy}`;
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const masters = JSON.parse(formData.get("masters")?.toString() || "{}");
    const duplicateHandling = (formData.get("duplicateHandling")?.toString() || "skip") as "skip" | "update";

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" });
    }

    const excelRows = await parseExcel(file);

    const summary = { created: 0, updated: 0, skipped: 0, failed: 0 };
    const errorRows: any[] = [];

    for (let idx = 0; idx < excelRows.length; idx++) {
      const row: any = excelRows[idx];
      try {
        const firstName = String(row["First Name"] ?? "").trim();
        const lastName = String(row["Last Name"] ?? "").trim();
        const email = String(row["Email"] ?? "").trim();
        const mobile = String(row["Mobile"] ?? "").trim();
        const dobRaw = row["DOB"];
        const dob = dobRaw instanceof Date ? dobRaw : new Date(dobRaw);

        if (!firstName || !lastName || !email || !mobile || !dob || isNaN(dob.getTime())) {
          summary.failed++;
          errorRows.push({ row: idx + 2, errors: ["Invalid required fields"] });
          continue;
        }

        const password = genPassword(firstName, dob);

        const existing = await Student.findOne({ $or: [{ email }, { mobile }] });

        if (existing) {
          if (duplicateHandling === "skip") {
            summary.skipped++;
            errorRows.push({ row: idx + 2, errors: ["Duplicate — skipped"] });
            continue;
          } else if (duplicateHandling === "update") {
            existing.firstName = firstName;
            existing.lastName = lastName;
            existing.dob = dob;
            existing.password = password;
            existing.currentClass = masters.currentClass;
            existing.stream = masters.stream;
            existing.section = masters.section;
            existing.academicSession = masters.academicSession;
            existing.nationality = masters.nationality;
            existing.country = masters.country || "India";
            existing.role = "student";
            await existing.save();
            summary.updated++;
            continue;
          }
        }

// 🔹 Registration ID
      const registrationId = await generateRegistrationId();

        const student = new Student({
          firstName,
          lastName,
          email,
          mobile,
          dob,
          password,
          currentClass: masters.currentClass,
          stream: masters.stream,
          section: masters.section,
          academicSession: masters.academicSession,
          nationality: masters.nationality,
          country: masters.country || "India",
          role: "student",
          registrationId,
        });
        await student.save();
        summary.created++;
      } catch (err) {
        console.error("Row error", err);
        summary.failed++;
        errorRows.push({ row: idx + 2, errors: ["Server error saving row"] });
      }
    }

    return NextResponse.json({ success: true, summary, errorRows });
  } catch (err) {
    console.error("Bulk upload error", err);
    return NextResponse.json({ success: false, message: "Server error during bulk upload." });
  }
}

2*/

/*3
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Student from "@/models/User";
import * as XLSX from "xlsx";
import fs from "fs";
import os from "os";
import path from "path";
import { generateRegistrationId } from "@/lib/id";

export const config = {
  api: {
    bodyParser: false,
  },
};

function genPassword(firstName: string, dob: Date) {
  const fn = (firstName || "").trim().slice(0, 2);
  const dd = String(dob.getDate()).padStart(2, "0");
  const mm = String(dob.getMonth() + 1).padStart(2, "0");
  const yyyy = String(dob.getFullYear());
  return `${fn}${dd}${mm}${yyyy}`;
}

// Parse Excel by writing temp file (robust on Node server)
async function parseExcelToRows(fileBlob: Blob) {
  const arrayBuffer = await fileBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const tmpDir = os.tmpdir();
  const tmpName = `stu_upload_${Date.now()}_${Math.floor(Math.random() * 10000)}.xlsx`;
  const tmpPath = path.join(tmpDir, tmpName);

  try {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  return rows;
  } finally {
    try {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch (e) {
      console.warn("Failed to delete temp file", tmpPath, e);
    }
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const mastersRaw = formData.get("masters")?.toString() ?? "{}";
    const masters = JSON.parse(mastersRaw);
    const duplicateHandling = (formData.get("duplicateHandling")?.toString() || "skip") as "skip" | "update";

    if (!file) return NextResponse.json({ success: false, message: "No file uploaded." }, { status: 400 });

    const excelRows = await parseExcelToRows(file);

    const summary = { created: 0, updated: 0, skipped: 0, failed: 0 };
    const errorRows: any[] = [];
    const skippedRows: any[] = [];

    for (let i = 0; i < excelRows.length; i++) {
      const row = excelRows[i];
      const rowNum = i + 2; // header is row 1
      try {
        const firstName = String(row["First Name"] ?? "").trim();
        const lastName = String(row["Last Name"] ?? "").trim();
        const email = String(row["Email"] ?? "").trim();
        const mobile = String(row["Mobile"] ?? "").trim();
        const dobRaw = row["DOB"];
        const dob = dobRaw instanceof Date ? dobRaw : new Date(dobRaw);

        // basic validation
        const errors: string[] = [];
        if (!firstName) errors.push("First Name missing");
        if (!lastName) errors.push("Last Name missing");
        if (!email) errors.push("Email missing");
        if (!mobile) errors.push("Mobile missing");
        if (!dob || isNaN(dob.getTime())) errors.push("Invalid DOB");

        if (errors.length) {
          summary.failed++;
          errorRows.push({ row: rowNum, firstName, lastName, email, mobile, dobRaw, errors });
          continue;
        }

        const password = genPassword(firstName, dob);

        const existing = await Student.findOne({ $or: [{ email }, { mobile }] });

        if (existing) {
          if (duplicateHandling === "skip") {
            summary.skipped++;
            skippedRows.push({ row: rowNum, firstName, lastName, email, mobile, dobRaw, reason: "Duplicate — skipped" });
            continue;
          } else if (duplicateHandling === "update") {
            existing.firstName = firstName;
            existing.lastName = lastName;
            existing.dob = dob;
            existing.password = password;
            existing.currentClass = masters.currentClass;
            existing.stream = masters.stream;
            existing.section = masters.section;
            existing.academicSession = masters.academicSession;
            existing.nationality = masters.nationality;
            existing.country = masters.country || "India";
            existing.role = masters.role || "student";
            await existing.save();
            summary.updated++;
            continue;
          }
        }

// 🔹 Registration ID
      const registrationId = await generateRegistrationId();


        // create new student
        const student = new Student({
          firstName,
          lastName,
          email,
          mobile,
          dob,
          password,
          currentClass: masters.currentClass,
          stream: masters.stream,
          section: masters.section,
          academicSession: masters.academicSession,
          nationality: masters.nationality,
          country: masters.country || "India",
          role: masters.role || "student",
          registrationId,
          updatesHistory: [],
        });

        await student.save();
        summary.created++;
      } catch (rowErr) {
        console.error("Row error:", rowErr);
        summary.failed++;
        errorRows.push({ row: rowNum, ...row, errors: ["Server error saving row"] });
      }
    }

    return NextResponse.json({ success: true, summary, errorRows, skippedRows });
  } catch (err) {
    console.error("Bulk upload error:", err);
    return NextResponse.json({ success: false, message: "Server error during bulk upload." }, { status: 500 });
  }
}
3*/