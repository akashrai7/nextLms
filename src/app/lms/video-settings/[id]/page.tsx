"use client";

// import Nav from "@/components/LMS/video/Nav";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { usePathname } from "next/navigation";



type Settings = {
  languages?: any[];
  instructors?: any[];
  courseLevels?: any[];
  videoSources?: any[];
};

type CourseData = {
  courseType: string[]; // or single string depending on your design; using array as add used
  language: string;
  instructor: string;
  title: string;
  thumbnail?: string;
  coverPhoto?: string;
  certificateBase?: string;
  demoVideo: string;
  videoSource: string;
  courseLevel: string;
  summary: string;
  description: string;
  certificate: "YES" | "NO" | "";
  createdBy?: string;
};

export default function CourseEditForm() {
  const pathname = usePathname();
  // const courseId = pathname.split("/").pop();
  const segments = pathname.split("/").filter(Boolean); // empty string hata do
  const courseId = segments[segments.length - 1]; // last part hamesha ID hoga

  const [form, setForm] = useState<CourseData>({
    courseType: [],
    language: "",
    instructor: "",
    title: "",
    demoVideo: "",
    videoSource: "",
    courseLevel: "",
    summary: "",
    description: "",
    certificate: "",
  });

  const [settings, setSettings] = useState<Settings>({});
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // ---------- helpers ----------
  const setField = (k: keyof CourseData, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  // checkbox handling (courseType as array)
  const toggleCourseType = (val: string) => {
    setForm((p) => {
      const exists = p.courseType.includes(val);
      return { ...p, courseType: exists ? p.courseType.filter((c) => c !== val) : [...p.courseType, val] };
    });
  };

  // file change handlers with preview + client-side size checks
  const handleFile = (file: File | null, target: "thumbnail" | "cover" | "certificate") => {
    if (!file) {
      if (target === "thumbnail") { setThumbnailFile(null); setThumbnailPreview(null); }
      if (target === "cover") { setCoverFile(null); setCoverPreview(null); }
      if (target === "certificate") { setCertificateFile(null); setCertificatePreview(null); }
      return;
    }

    // size validation
if (target === "thumbnail" || target === "cover") {
  if (file.size > 500 * 1024) {
    setMessage({
      type: "error",
      text: `${target === "thumbnail" ? "Thumbnail" : "Cover"} must be under 500KB`
    });
    return;
  }
}

if (target === "certificate") {
  if (file.size > 5 * 1024 * 1024) {
    setMessage({
      type: "error",
      text: "Certificate base must be under 5MB"
    });
    return;
  }
}


    const url = URL.createObjectURL(file);
    if (target === "thumbnail") { setThumbnailFile(file); setThumbnailPreview(url); }
    if (target === "cover") { setCoverFile(file); setCoverPreview(url); }
    if (target === "certificate") { setCertificateFile(file); setCertificatePreview(url); }
    setMessage(null);
  };

  // ---------- fetch settings + course ----------
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [t, i, c, v, courseRes] = await Promise.all([
          axios.get("/api/settings/training_language"),
          axios.get("/api/user?role=teacher"), // make sure backend returns teachers
          axios.get("/api/settings/course_level"),
          axios.get("/api/settings/video_source"),
          axios.get(`/api/courses/${courseId}`),
        ]);

        setSettings({
          languages: t.data.data,
          instructors: i.data.data,
          courseLevels: c.data.data,
          videoSources: v.data.data,
        });

        const cd = courseRes.data.data || courseRes.data.course; // adapt to your API shape
        // map response to our form shape
        const mapped: CourseData = {
          courseType: Array.isArray(cd.courseType) ? cd.courseType : (cd.courseType ? [cd.courseType] : []),
          language: cd.language?._id || cd.language || "",
          instructor: cd.instructor?._id || cd.instructor || "",
          title: cd.title || "",
          thumbnail: cd.thumbnail || "",
          coverPhoto: cd.coverPhoto || "",
          certificateBase: cd.certificateBase || "",
          demoVideo: cd.demoVideo || "",
          videoSource: cd.videoSource?._id || cd.videoSource || "",
          courseLevel: cd.courseLevel?._id || cd.courseLevel || "",
          summary: cd.summary || "",
          description: cd.description || "",
          certificate: cd.certificate || "",
          createdBy: cd.createdBy?._id || cd.createdBy || "",
        };
console.log("API response:", courseRes.data);
        setForm(mapped);

        if (mapped.thumbnail) setThumbnailPreview(mapped.thumbnail);
        if (mapped.coverPhoto) setCoverPreview(mapped.coverPhoto);
        if (mapped.certificateBase) setCertificatePreview(mapped.certificateBase);
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Failed to load course or settings" });
      }
    };
    fetchAll();
  }, [courseId]);

  // ---------- submit ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // client-side required validation (mirror backend messages)
    if (!form.courseType || form.courseType.length === 0) { setMessage({ type: "error", text: "Course type is required" }); return; }
    if (!form.language) { setMessage({ type: "error", text: "Language is required" }); return; }
    if (!form.instructor) { setMessage({ type: "error", text: "Instructor is required" }); return; }
    if (!form.title) { setMessage({ type: "error", text: "Course title is required" }); return; }
    if (!form.demoVideo) { setMessage({ type: "error", text: "Demo video link is required" }); return; }
    if (!form.videoSource) { setMessage({ type: "error", text: "Video source is required" }); return; }
    if (!form.courseLevel) { setMessage({ type: "error", text: "Course level is required" }); return; }
    if (!form.summary) { setMessage({ type: "error", text: "Course summary is required" }); return; }
    if (!form.description) { setMessage({ type: "error", text: "Course description is required" }); return; }
    if (!form.certificate) { setMessage({ type: "error", text: "Certificate selection is required" }); return; }

    // file size re-check (in case)
    if (thumbnailFile && thumbnailFile.size > 500 * 1024) { setMessage({ type: "error", text: "Thumbnail must be under 500KB" }); return; }
    if (coverFile && coverFile.size > 500 * 1024) { setMessage({ type: "error", text: "Cover photo must be under 500KB" }); return; }
    if (certificateFile && certificateFile.size > 5 * 1024 * 1024) { setMessage({ type: "error", text: "Certificate must be under 5MB" }); return; }

    // Build FormData
    const fd = new FormData();
    // append arrays as multiple entries
    form.courseType.forEach((ct) => fd.append("courseType", ct));
    // append other fields
    fd.append("language", form.language);
    fd.append("instructor", form.instructor);
    fd.append("title", form.title);
    fd.append("demoVideo", form.demoVideo);
    fd.append("videoSource", form.videoSource);
    fd.append("courseLevel", form.courseLevel);
    fd.append("summary", form.summary);
    fd.append("description", form.description);
    fd.append("certificate", form.certificate);

    // files (only if changed)
    if (thumbnailFile) fd.append("thumbnail", thumbnailFile);
    if (coverFile) fd.append("coverPhoto", coverFile);
    if (certificateFile) fd.append("certificateBase", certificateFile);

    setLoading(true);
    try {
      // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      // const res = await fetch(`/api/courses/${courseId}`, {
      //   method: "PUT",
      //   body: fd,
      //   headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      // });

const token = localStorage.getItem("token");

const res = await fetch(`/api/courses/${courseId}`, {
  method: "PUT",
  body: fd,
  headers: { Authorization: `Bearer ${token}` },
});

      const json = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: json.message || "Course updated successfully" });
      } else {
        setMessage({ type: "error", text: json.error || json.message || "Failed to update course" });
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  // ---------- small UI helpers ----------
  const InputLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
  );

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Settings</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard/"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>
 
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Settings
          </li>
        </ol>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          {/* <Nav /> */}
{/* start Nav */}
 <ul className="mb-[10px]">
        <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href={`/lms/video-settings/video-chapter/${courseId}`}
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === `/lms/video-settings/video-chapter/${courseId}/` 
              ? "bg-primary-500 text-white" : ""
            }`}
          >
            Video Chapter
          </Link>
        </li>

        <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href={`/lms/video-settings/video-title/${courseId}`}
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === `/lms/video-settings/video-title/${courseId}/`
                ? "bg-primary-500 text-white" : ""
            }`}
          >
            Video Title
          </Link>
        </li>

         <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href={`/lms/video-settings/video-link/${courseId}`}
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === `/lms/video-settings/video-link/${courseId}/`
                ? "bg-primary-500 text-white" : ""
            }`}
          >
            Video link
          </Link>
        </li>
        <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href={`/lms/video-settings/${courseId}`}
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === `/lms/video-settings/${courseId}/`
                ? "bg-primary-500 text-white"
                : ""
            }`}
          >
           Edit Course Details
          </Link>
        </li>
      </ul>
{/* end Nav  mx-auto */}
           <div className="max-w-4xl  p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4">Edit Course</h2>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="relative w-full">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                          Course Title
                        </label>
                        <input
                          name="title" value={form.title} 
                          onChange={(e) => setField("title", e.target.value)}
                          placeholder="Enter Chapter"
                          className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
                          required
                        />
              </div> 
          </div>
          <div>
            <div className="relative w-full">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                          Language
                        </label>
                        <select value={form.language} 
                          onChange={(e) => setField("language", e.target.value)} 
                          className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
                          required >
                        <option value="">Select</option>
                          {settings.languages?.map((l: any) => <option key={l._id} value={l._id}>{l.name}</option>)}
                        </select>
              </div> 
          </div>
          <div>
            <div className="relative w-full">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                          Instructor
                        </label>
                        <select value={form.instructor} 
                          onChange={(e) => setField("instructor", e.target.value)} 
                          className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
                          required
                          >
                          <option value="">Select</option>
                          {settings.instructors?.map((u: any) => <option key={u._id} value={u._id}>{u.firstName || u.name}</option>)}
                        </select>
             </div> 
          </div>
          <div>
            <div className="relative w-full">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                          Course Level
                        </label>
                       <select value={form.courseLevel} 
                         onChange={(e) => setField("courseLevel", e.target.value)} 
                         className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
                          required
                          >
                        <option value="">Select</option>
                        {settings.courseLevels?.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                       </select>
             </div> 
          </div>
           <div>
            <div className="relative w-full">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                          Video Source
                        </label>
                       <select value={form.videoSource} 
                         onChange={(e) => setField("videoSource", e.target.value)} 
                         className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
                          required
                          >
                      <option value="">Select</option>
                        {settings.videoSources?.map((v: any) => <option key={v._id} value={v._id}>{v.name}</option>)}
                      </select>
             </div> 
          </div>
          <div>
            <div className="relative w-full">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                         Certificate
                        </label>
                       <select value={form.certificate} 
                         onChange={(e) => setField("certificate", e.target.value as "YES" | "NO" | "")} 
                         className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
                          required
                          >
                        <option value="">Select</option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
             </div> 
          </div>

        <div>
          <div className="relative w-full">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                         Course Summary
                        </label>
            <textarea value={form.summary} 
              onChange={(e) => setField("summary", e.target.value)} 
              className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
                          required
                          >
          </div>
        </div>
        
        <div>
           <div className="relative w-full">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                         Course Description
                        </label>
            <textarea value={form.description} 
            onChange={(e) => setField("description", e.target.value)} 
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
                          required
                          >
          </div>
         </div>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="relative w-full">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                         Thumbnail (≤ 500KB)
                        </label>
            <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] || null, "thumbnail")} />
            {thumbnailPreview && <div className="mt-2"><img src={thumbnailPreview} alt="thumb" className="w-24 h-16 object-cover rounded" /></div>}
          </div>
        </div>
          <div>
            <div className="relative w-full">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                         Cover Photo (≤ 500KB)
                        </label>
            <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] || null, "cover")} />
            {coverPreview && <div className="mt-2"><img src={coverPreview} alt="cover" className="w-24 h-16 object-cover rounded" /></div>}
          </div>
        </div>
          
          <div>
            <div className="relative w-full">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                         Certificate Base (≤ 5MB)
                        </label>
            <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] || null, "certificate")} />
            {certificatePreview && <div className="mt-2"><img src={certificatePreview} alt="cert" className="w-24 h-16 object-cover rounded" /></div>}
          </div>
        </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" 
                checked={form.courseType.includes("Online")} 
                onChange={() => toggleCourseType("Online")} />
              <span>Online</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" 
                checked={form.courseType.includes("Offline")} 
                onChange={() => toggleCourseType("Offline")} />
              <span>Offline</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-md">
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={() => { /* optional reset or cancel */ }} className="px-4 py-2 border rounded-md">Cancel</button>
        </div>
      </form>
    </div>
        </div>
    </>
  );
}
