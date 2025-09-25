"use client";

import React, { useState, useEffect } from "react";
import Nav from "@/components/LMS/video/Nav";
import Link from "next/link";
import axios from "axios";
import { usePathname } from "next/navigation";

type Chapter = {
  _id: string;
  name: string;
};

type VideoRow = {
  chapter: string;
  title: string;
  description: string;
  thumbnail: File | null;
  videoFile: File | null;
  thumbnailPreview?: string;
  videoFileName?: string;
};

export default function CourseVideosForm() {

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // empty string hata do
  const courseId = segments[segments.length - 1]; // last part hamesha ID hoga


  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [videos, setVideos] = useState<VideoRow[]>([
    { chapter: "", title: "", description: "", thumbnail: null, videoFile: null },
  ]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch chapters from API
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await axios.get(`/api/settings/chapter`);
        if (res.data.ok) setChapters(res.data.data);
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Failed to load chapters" });
      }
    };
    fetchChapters();
  }, []);

  // Add new row
  const addRow = () => {
    setVideos([
      ...videos,
      { chapter: "", title: "", description: "", thumbnail: null, videoFile: null },
    ]);
  };

  // Remove row
  const removeRow = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  // Handle field change
  const handleChange = (index: number, field: keyof VideoRow, value: any) => {
    const updated = [...videos];
    updated[index][field] = value;
    setVideos(updated);
  };

  // Handle file upload (with preview + size validation)
  const handleFile = (index: number, field: "thumbnail" | "videoFile", file: File | null) => {
    if (!file) return;

    if (field === "thumbnail" && file.size > 500 * 1024) {
      setMessage({ type: "error", text: "Thumbnail must be ≤ 500KB" });
      return;
    }

    const updated = [...videos];
    updated[index][field] = file;

    if (field === "thumbnail") {
      updated[index].thumbnailPreview = URL.createObjectURL(file);
    }
    if (field === "videoFile") {
      updated[index].videoFileName = file.name;
    }

    setVideos(updated);
  };

  // Submit all videos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Basic validation
    for (let i = 0; i < videos.length; i++) {
      const v = videos[i];
      if (!v.chapter || !v.title || !v.description || !v.thumbnail || !v.videoFile) {
        setMessage({ type: "error", text: `Row ${i + 1}: All fields are required` });
        return;
      }
    }

    const fd = new FormData();
    fd.append("courseId", courseId);

    videos.forEach((v, i) => {
      fd.append(`videos[${i}][chapter]`, v.chapter);
      fd.append(`videos[${i}][title]`, v.title);
      fd.append(`videos[${i}][description]`, v.description);
      if (v.thumbnail) fd.append(`videos[${i}][thumbnail]`, v.thumbnail);
      if (v.videoFile) fd.append(`videos[${i}][videoFile]`, v.videoFile);
    });

    setLoading(true);
    try {
      const res = await fetch("/api/addVideo", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Videos saved successfully!" });
        setVideos([{ chapter: "", title: "", description: "", thumbnail: null, videoFile: null }]); // reset
      } else {
        setMessage({ type: "error", text: json.error || "Failed to save videos" });
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Video Title</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard/ecommerce/"
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

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Video Title
          </li>
        </ol>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <Nav />
          
         {/* form start */}
         <h4 className="text-2xl font-semibold mb-4">Add Course Videos</h4>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {videos.map((v, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg bg-gray-50 relative"
          >
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="absolute top-2 right-2 text-red-500 text-sm"
              disabled={videos.length === 1}
            >
              ✕ Remove
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Chapter */}
              <div className="relative w-full">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                          Chapter Title
                        </label>
                <select
                  value={v.chapter}
                  onChange={(e) => handleChange(index, "chapter", e.target.value)}
                  className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
                  required
                >
                  <option value="">Select Chapter</option>
                  {chapters.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="relative w-full">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                      Video Title
                  </label>
                <input
                  type="text"
                  value={v.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
                  required
                  placeholder="Enter video title"
                />
              </div>
            </div>

            {/* Description */}
            <div className="relative w-full">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                      Description
                  </label>
              <textarea
                value={v.description}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
                placeholder="Enter video description"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              {/* Thumbnail */}
              <div className="relative w-full">
                  <label className="absolute -top-2 left-3 bg-white px-2 text-sm text-gray-500">
                      Thumbnail (≤ 500KB)
                  </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(index, "thumbnail", e.target.files?.[0] || null)}
                />
                {v.thumbnailPreview && (
                  <img
                    src={v.thumbnailPreview}
                    alt="thumb"
                    className="mt-2 w-32 h-20 object-cover rounded"
                  />
                )}
              </div>

              {/* Video File */}
              <div className="relative w-full">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                      Video File
                  </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFile(index, "videoFile", e.target.files?.[0] || null)}
                />
                {v.videoFileName && <p className="mt-2 text-sm">{v.videoFileName}</p>}
              </div>
            </div>
          </div>
        ))}

        {/* Add Row Button */}
        <button
          type="button"
          onClick={addRow}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          + Add Video
        </button>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md"
          >
            {loading ? "Saving..." : "Save Videos"}
          </button>
        </div>
      </form>
         {/* form end */}
        </div>
      </div>
    </>
  );
}
