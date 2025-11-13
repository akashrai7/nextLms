"use client";

import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";

type MasterOption = { _id: string; name?: string; code?: string; value?: string };

type MastersSelected = {
  currentClass: string;
  stream: string;
  section: string;
  academicSession: string;
  nationality: string;
  country: string;
  role: string;
};

type ParsedRow = {
  __rowNum__: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dobRaw: any;
  dob?: string;
  passwordPlain?: string;
  errors: string[];
  valid: boolean;
};

const UPLOAD_URL = "/api/students/bulk";

export default function BulkUploadPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileObj, setFileObj] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [currentClasses, setCurrentClasses] = useState<MasterOption[]>([]);
  const [streams, setStreams] = useState<MasterOption[]>([]);
  const [sections, setSections] = useState<MasterOption[]>([]);
  const [academicSessions, setAcademicSessions] = useState<MasterOption[]>([]);
  const [nationalities, setNationalities] = useState<MasterOption[]>([]);

  const [masters, setMasters] = useState<MastersSelected>({
    currentClass: "",
    stream: "",
    section: "",
    academicSession: "",
    nationality: "",
    country: "India",
    role: "student",
  });

  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [validCount, setValidCount] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);

  const [loadingMasters, setLoadingMasters] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [duplicateHandling, setDuplicateHandling] = useState<"skip" | "update">("skip");

  const [skippedRows, setSkippedRows] = useState<any[]>([]);
  const [errorRows, setErrorRows] = useState<any[]>([]);

  useEffect(() => {
    const fetchMasters = async () => {
      setLoadingMasters(true);
      try {
        const [clRes, streamRes, sectionRes, natRes, sessionRes] = await Promise.all([
          fetch("/api/settings/current_class").then((r) => r.json()),
          fetch("/api/settings/stream").then((r) => r.json()),
          fetch("/api/settings/section").then((r) => r.json()),
          fetch("/api/settings/nationality").then((r) => r.json()),
          fetch("/api/settings/academic_session").then((r) => r.json()),
        ]);
        setCurrentClasses(clRes?.data ?? []);
        setStreams(streamRes?.data ?? []);
        setSections(sectionRes?.data ?? []);
        setNationalities(natRes?.data ?? []);
        setAcademicSessions(sessionRes?.data ?? []);
      } catch (err) {
        console.error("fetch masters error", err);
        setMessage("Failed to load master data — check settings endpoints.");
      } finally {
        setLoadingMasters(false);
      }
    };
    fetchMasters();
  }, []);

  function isValidEmail(email: string) {
    return /^\S+@\S+\.\S+$/.test(email);
  }
  function isValidMobile(m: string) {
    return /^\d{10}$/.test(m);
  }

  function parseDOB(raw: any): Date | null {
    if (!raw && raw !== 0) return null;
    if (raw instanceof Date && !isNaN(raw.getTime())) return raw;
    if (typeof raw === "number") {
      const date = new Date(Math.round((raw - 25569) * 86400 * 1000));
      if (!isNaN(date.getTime())) return date;
    }
    if (typeof raw === "string") {
      const s = raw.trim();
      const dmy = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
      if (dmy) {
        const dd = Number(dmy[1]);
        const mm = Number(dmy[2]) - 1;
        const yyyy = Number(dmy[3]);
        const dt = new Date(yyyy, mm, dd);
        if (!isNaN(dt.getTime())) return dt;
      }
      const ymd = s.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/);
      if (ymd) {
        const yyyy = Number(ymd[1]);
        const mm = Number(ymd[2]) - 1;
        const dd = Number(ymd[3]);
        const dt = new Date(yyyy, mm, dd);
        if (!isNaN(dt.getTime())) return dt;
      }
      const dt = new Date(s);
      if (!isNaN(dt.getTime())) return dt;
    }
    return null;
  }

  function genPlainPassword(firstName: string, dob: Date) {
    const fn = (firstName || "").trim().slice(0, 2);
    const dd = String(dob.getDate()).padStart(2, "0");
    const mm = String(dob.getMonth() + 1).padStart(2, "0");
    const yyyy = String(dob.getFullYear());
    return `${fn}${dd}${mm}${yyyy}`;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    setParsedRows([]);
    setValidCount(0);
    setInvalidCount(0);
    setSkippedRows([]);
    setErrorRows([]);
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    setFileObj(f);
    setFileName(f.name);
    await parseFileAndPreview(f);
  };

  async function parseFileAndPreview(file: File) {
    setParsing(true);
    setParsedRows([]);
    setValidCount(0);
    setInvalidCount(0);

    try {
      const allowed = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
        "application/csv",
      ];
      if (!allowed.includes(file.type) && !file.name.endsWith(".csv") && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        setMessage("Only CSV / XLSX files are supported.");
        setParsing(false);
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
      if (!workbook.SheetNames.length) {
        setMessage("No sheets found in file.");
        setParsing(false);
        return;
      }
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawJson: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      if (!rawJson.length) {
        setMessage("Uploaded file contains no data rows.");
        setParsing(false);
        return;
      }

      const expected = ["First Name", "Last Name", "Email", "Mobile", "DOB"];
      const sheetHeaders = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] as string[] | undefined;
      const missingHeaders = expected.filter(h => !(sheetHeaders ?? []).map(s=>String(s).trim()).includes(h));
      if (missingHeaders.length) {
        setMessage(`Missing required columns: ${missingHeaders.join(", ")}. Please use the template format.`);
        setParsing(false);
        return;
      }

      const seenEmails = new Map<string, number>();
      const seenMobiles = new Map<string, number>();

      const outRows: ParsedRow[] = rawJson.map((r, idx) => {
        const rowNum = idx + 2;
        const firstName = String(r["First Name"] ?? "").trim();
        const lastName = String(r["Last Name"] ?? "").trim();
        const email = String(r["Email"] ?? "").trim();
        const mobile = String(r["Mobile"] ?? "").trim();
        const dobRaw = r["DOB"];
        const errors: string[] = [];

        if (!firstName) errors.push("First Name missing");
        if (!lastName) errors.push("Last Name missing");
        if (!email) errors.push("Email missing");
        else if (!isValidEmail(email)) errors.push("Invalid email format");
        if (!mobile) errors.push("Mobile missing");
        else if (!isValidMobile(mobile)) errors.push("Mobile must be 10 digits");

        const dobDate = parseDOB(dobRaw);
        if (!dobDate) errors.push("Invalid DOB");
        else if (dobDate.getTime() > new Date().getTime()) errors.push("DOB cannot be in future");

        const emailKey = email.toLowerCase();
        if (emailKey) {
          if (seenEmails.has(emailKey)) errors.push(`Duplicate email in file (row ${seenEmails.get(emailKey)})`);
          else seenEmails.set(emailKey, rowNum);
        }
        if (mobile) {
          if (seenMobiles.has(mobile)) errors.push(`Duplicate mobile in file (row ${seenMobiles.get(mobile)})`);
          else seenMobiles.set(mobile, rowNum);
        }

        const valid = errors.length === 0;
        const dobIso = dobDate ? dobDate.toISOString() : undefined;
        const passwordPlain = valid ? genPlainPassword(firstName, dobDate!) : undefined;

        return {
          __rowNum__: rowNum,
          firstName,
          lastName,
          email,
          mobile,
          dobRaw,
          dob: dobIso,
          passwordPlain,
          errors,
          valid,
        } as ParsedRow;
      });

      setParsedRows(outRows);
      setValidCount(outRows.filter(r => r.valid).length);
      setInvalidCount(outRows.filter(r => !r.valid).length);
    } catch (err) {
      console.error("parse error", err);
      setMessage("Failed to parse file. Check file format and try again.");
    } finally {
      setParsing(false);
    }
  }

  function downloadErrorReportCsv() {
    const errs = parsedRows.filter(r => !r.valid).map(r => ({
      Row: r.__rowNum__,
      "First Name": r.firstName,
      "Last Name": r.lastName,
      Email: r.email,
      Mobile: r.mobile,
      DOB: r.dobRaw,
      Errors: r.errors.join("; "),
    }));
    if (!errs.length) return;
    const worksheet = XLSX.utils.json_to_sheet(errs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Errors");
    XLSX.writeFile(wb, `student_import_errors_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  function downloadRows(rows: any[], fileName: string) {
    if (!rows.length) return;
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Data");
    XLSX.writeFile(wb, fileName);
  }

  async function handleSave() {
    setMessage(null);

    if (!masters.currentClass || !masters.stream || !masters.section || !masters.academicSession || !masters.nationality) {
      setMessage("Please select all master dropdowns before saving.");
      return;
    }

    const validRows = parsedRows.filter(r => r.valid);
    if (!validRows.length) {
      setMessage("No valid rows to save.");
      return;
    }

    setSaving(true);
    try {
      // prepare minimal sheet (First Name, Last Name, Email, Mobile, DOB)
      const toExport = validRows.map(r => ({
        "First Name": r.firstName,
        "Last Name": r.lastName,
        "Email": r.email,
        "Mobile": r.mobile,
        "DOB": r.dob ? new Date(r.dob).toLocaleDateString("en-GB").replace(/\//g, "-") : "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(toExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, worksheet, "Students");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const uploadFile = new File([blob], `students_upload_${Date.now()}.xlsx`, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      const fd = new FormData();
      fd.append("file", uploadFile);
      fd.append("masters", JSON.stringify(masters));
      fd.append("duplicateHandling", duplicateHandling);

      const res = await fetch(UPLOAD_URL, { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || "Upload failed.");
        return;
      }

      setMessage(`Import finished. Created: ${data.summary.created}, Updated: ${data.summary.updated}, Skipped: ${data.summary.skipped}, Failed: ${data.summary.failed}`);

      setSkippedRows(data.skippedRows || []);
      setErrorRows(data.errorRows || []);

      // reset everything after successful import
      setParsedRows([]);
      setValidCount(0);
      setInvalidCount(0);
      setFileName(null);
      setFileObj(null);
      setMasters({
        currentClass: "",
        stream: "",
        section: "",
        academicSession: "",
        nationality: "",
        country: "India",
        role: "student",
      });

      // reset native file input
      if (fileInputRef.current) fileInputRef.current.value = "";

      setTimeout(() => {
        setMessage(null);
      }, 8000);
    } catch (err) {
      console.error("save error", err);
      setMessage("Save failed. See console for details.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
      
    <div className="p-6 max-w-6xl mx-auto">
      <h4 className="text-2xl font-semibold mb-4">Bulk Student Upload</h4>

      {message && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block mb-1 text-sm">Class</label>
          <select
            value={masters.currentClass}
            onChange={(e) => setMasters({ ...masters, currentClass: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
            disabled={loadingMasters}
          >
            <option value="">Select Class</option>
            {currentClasses.map((c) => <option key={c._id ?? c.value} value={c._id ?? c.value}>{c.name ?? c.value ?? c.code}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm">Stream</label>
          <select
            value={masters.stream}
            onChange={(e) => setMasters({ ...masters, stream: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
            disabled={loadingMasters}
          >
            <option value="">Select Stream</option>
            {streams.map((c) => <option key={c._id ?? c.value} value={c._id ?? c.value}>{c.name ?? c.value ?? c.code}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm">Section</label>
          <select
            value={masters.section}
            onChange={(e) => setMasters({ ...masters, section: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
            disabled={loadingMasters}
          >
            <option value="">Select Section</option>
            {sections.map((c) => <option key={c._id ?? c.value} value={c._id ?? c.value}>{c.name ?? c.value ?? c.code}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm">Academic Session</label>
          <select
            value={masters.academicSession}
            onChange={(e) => setMasters({ ...masters, academicSession: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
            disabled={loadingMasters}
          >
            <option value="">Select Session</option>
            {academicSessions.map((c) => <option key={c._id ?? c.value} value={c._id ?? c.value}>{c.name ?? c.value ?? c.code}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm">Nationality</label>
          <select
            value={masters.nationality}
            onChange={(e) => setMasters({ ...masters, nationality: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
            disabled={loadingMasters}
          >
            <option value="">Select Nationality</option>
            {nationalities.map((c) => <option key={c._id ?? c.value} value={c._id ?? c.value}>{c.name ?? c.value ?? c.code}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm">Country</label>
          <input type="text" value="India" readOnly className="w-full border p-2 rounded bg-gray-100" />
        </div>

        <div>
          <label className="block mb-1 text-sm">Role</label>
          <input type="text" value="student" readOnly className="w-full border p-2 rounded bg-gray-100" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm">Upload CSV / XLSX (Columns: First Name, Last Name, Email, Mobile, DOB)</label>
        <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
        {fileName && <div className="text-sm text-gray-600 mt-1">Selected: {fileName}</div>}
        {parsing && <div className="text-sm text-blue-600 mt-1">Parsing file...</div>}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-sm">Valid: <strong>{validCount}</strong></div>
        <div className="text-sm">Invalid: <strong>{invalidCount}</strong></div>

        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm">Duplicate handling:</label>
          <select value={duplicateHandling} onChange={(e) => setDuplicateHandling(e.target.value as any)} 
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none placeholder-gray-400 focus:border-primary-400">
            <option value="skip">Skip existing</option>
            <option value="update">Update existing</option>
          </select>
        </div>
      </div>

      {parsedRows.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 font-medium">Preview (showing up to first 200 rows)</div>

          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 border">Row</th>
                  <th className="p-2 border">First Name</th>
                  <th className="p-2 border">Last Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Mobile</th>
                  <th className="p-2 border">DOB</th>
                  <th className="p-2 border">Password (plain)</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {parsedRows.slice(0, 200).map((r) => (
                  <tr key={r.__rowNum__} className={r.valid ? "" : "bg-red-50"}>
                    <td className="p-2 border align-top">{r.__rowNum__}</td>
                    <td className="p-2 border align-top">{r.firstName}</td>
                    <td className="p-2 border align-top">{r.lastName}</td>
                    <td className="p-2 border align-top">{r.email}</td>
                    <td className="p-2 border align-top">{r.mobile}</td>
                    <td className="p-2 border align-top">{r.dob ? new Date(r.dob).toLocaleDateString() : String(r.dobRaw)}</td>
                    <td className="p-2 border align-top">{r.passwordPlain ?? "-"}</td>
                    <td className="p-2 border align-top text-sm">
                      {r.valid ? <span className="text-green-700">Valid</span> : <span className="text-red-700">{r.errors.join("; ")}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {parsedRows.length > 200 && <div className="text-sm text-gray-500 mt-2">Showing first 200 rows out of {parsedRows.length}. Download errors to fix offline.</div>}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={downloadErrorReportCsv}
          disabled={parsedRows.filter(r => !r.valid).length === 0}
          className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50"
        >
          Download Error Report
        </button>

        <button
          onClick={handleSave}
          disabled={saving || parsedRows.filter(r => r.valid).length === 0}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : `Save Valid Rows (${parsedRows.filter(r => r.valid).length})`}
        </button>

        <button
          onClick={() => {
            setParsedRows([]);
            setValidCount(0);
            setInvalidCount(0);
            setFileName(null);
            setFileObj(null);
            setMessage(null);
            setMasters({
              currentClass: "",
              stream: "",
              section: "",
              academicSession: "",
              nationality: "",
              country: "India",
              role: "student",
            });
            setSkippedRows([]);
            setErrorRows([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          className="px-4 py-2 rounded border"
        >
          Reset
        </button>

        <button
          onClick={() => downloadRows(errorRows, `import_errors_${new Date().toISOString().slice(0,10)}.xlsx`)}
          disabled={!errorRows.length}
          className="px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-50"
        >
          Download Server Errors ({errorRows.length})
        </button>

        <button
          onClick={() => downloadRows(skippedRows, `skipped_records_${new Date().toISOString().slice(0,10)}.xlsx`)}
          disabled={!skippedRows.length}
          className="px-4 py-2 rounded bg-orange-600 text-white disabled:opacity-50"
        >
          Download Skipped ({skippedRows.length})
        </button>
      </div>
    </div>
    </div>
  );
}

