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
*/