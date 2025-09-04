// "use client";

// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
// import axios from "axios";

// interface Course {
//   _id: string;
//   title: string;
// }

// interface Video {
//   _id: string;
//   courseId: { _id: string; title: string };
//   title: string;
//   playbackUrl: string;
//   posterUrl?: string;
//   durationSec: number;
//   orderIndex: number;
//   createdBy: string;
// }

// const VideoSettings: React.FC = () => {
//   const [open, setOpen] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);

//   // Form
//   const [form, setForm] = useState({
//     courseId: "",
//     title: "",
//     playbackUrl: "",
//     posterUrl: "",
//     durationSec: "",
//     orderIndex: "",
//   });

//   // Data
//   const [videos, setVideos] = useState<Video[]>([]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Fetch videos
//   const fetchVideos = async () => {
//     const res = await axios.get(`/api/videos`);
//     if (res.data.ok) setVideos(res.data.data || res.data);
//   };

//   // Fetch courses for dropdown
//   const fetchCourses = async () => {
//     const res = await axios.get(`/api/courses`);
//     console.log("API Response 👉", res.data); 
//    try {
//     const res = await axios.get("/api/courses");
//     console.log("Courses API response:", res.data);
//     setCourses(res.data.data || []); 
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//   }

//   };

//   useEffect(() => {
//     fetchVideos();
//     fetchCourses();
//   }, []);

//   // Submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editId) {
//       await axios.put(`/api/videos/${editId}`, {
//         ...form,
//         durationSec: Number(form.durationSec),
//         orderIndex: Number(form.orderIndex),
//       });
//       setEditId(null);
//     } else {
//       await axios.post(`/api/videos`, {
//         ...form,
//         durationSec: Number(form.durationSec),
//         orderIndex: Number(form.orderIndex),
//         createdBy: "ADMIN001", // ✅ abhi ke liye static
//       });
//     }
//     setForm({
//       courseId: "",
//       title: "",
//       playbackUrl: "",
//       posterUrl: "",
//       durationSec: "",
//       orderIndex: "",
//     });
//     setOpen(false);
//     fetchVideos();
//   };

//   // Delete
//   const handleDelete = async (id: string) => {
//     await axios.delete(`/api/videos/${id}`);
//     fetchVideos();
//   };

//   // Filter + Pagination
//   const filtered = videos.filter((v) =>
//     v.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   const total = filtered.length;
//   const totalPages = Math.ceil(total / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const display = filtered.slice(startIndex, endIndex);

//   const handlePageChange = (page: number) => {
//     if (page > 0 && page <= totalPages) setCurrentPage(page);
//   };

//   return (
//     <>
//       {/* Page Header */}
//       <div className="mb-[25px] md:flex items-center justify-between">
//         <h5 className="!mb-0">Videos</h5>
//         <ol className="breadcrumb mt-[12px] md:mt-0">
//           <li className="breadcrumb-item">
//             <Link
//               href="/dashboard/"
//               className="inline-block transition-all hover:text-primary-500"
//             >
//               Dashboard
//             </Link>
//           </li>
//           <li className="breadcrumb-item">System Settings</li>
//           <li className="breadcrumb-item">Videos</li>
//         </ol>
//       </div>

//       {/* Table Card */}
//       <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
//         <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
//           {/* Search */}
//           <div className="trezo-card-title">
//             <form className="relative sm:w-[265px]">
//               <label className="absolute ltr:left-[13px] top-1/2 -translate-y-1/2">
//                 <i className="material-symbols-outlined">search</i>
//               </label>
//               <input
//                 type="text"
//                 placeholder="Search video..."
//                 className="bg-gray-50 border h-[36px] text-xs rounded-md w-full block pl-[38px]"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </form>
//           </div>

//           {/* Add Button */}
//           <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
//             <button
//               type="button"
//               className="inline-block rounded-md px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
//               onClick={() => setOpen(true)}
//             >
//               + Add New Video
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="table-responsive overflow-x-auto">
//           <table className="w-full">
//             <thead className="text-black dark:text-white">
//               <tr>
//                 <th className="px-[20px] py-[11px] bg-primary-50">S.No</th>
//                 <th className="px-[20px] py-[11px] bg-primary-50">Course</th>
//                 <th className="px-[20px] py-[11px] bg-primary-50">Title</th>
//                 <th className="px-[20px] py-[11px] bg-primary-50">Duration</th>
//                 <th className="px-[20px] py-[11px] bg-primary-50">Order</th>
//                 <th className="px-[20px] py-[11px] bg-primary-50">Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-black dark:text-white">
//               {display.map((v, index) => (
//                 <tr key={v._id}>
//                   <td className="px-[20px] py-[15px] border-b">{index + 1}</td>
//                   <td className="px-[20px] py-[15px] border-b">
//                     {v.courseId?.title}
//                   </td>
//                   <td className="px-[20px] py-[15px] border-b">{v.title}</td>
//                   <td className="px-[20px] py-[15px] border-b">{v.durationSec} sec</td>
//                   <td className="px-[20px] py-[15px] border-b">{v.orderIndex}</td>
//                   <td className="px-[20px] py-[15px] border-b">
//                     <button
//                       className="text-blue-500 mr-2"
//                       onClick={() => {
//                         setEditId(v._id);
//                         setForm({
//                           courseId: v.courseId._id,
//                           title: v.title,
//                           playbackUrl: v.playbackUrl,
//                           posterUrl: v.posterUrl || "",
//                           durationSec: v.durationSec.toString(),
//                           orderIndex: v.orderIndex.toString(),
//                         });
//                         setOpen(true);
//                       }}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="text-red-500"
//                       onClick={() => handleDelete(v._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {display.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="text-center py-4 text-gray-500">
//                     No videos found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-between items-center mt-3">
//           <p className="text-sm">
//             Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total} results
//           </p>
//           <div>
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-2"
//             >
//               Prev
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => handlePageChange(i + 1)}
//                 className={`px-2 ${currentPage === i + 1 ? "font-bold" : ""}`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-2"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       <Dialog open={open} onClose={setOpen} className="relative z-10">
//         <DialogBackdrop className="fixed inset-0 bg-black/30" />
//         <div className="fixed inset-0 flex items-center justify-center">
//           <DialogPanel className="bg-white dark:bg-[#0c1427] p-6 rounded-md w-full max-w-md">
//             <h3 className="text-lg font-medium mb-4">
//               {editId ? "Edit Video" : "Add Video"}
//             </h3>
//             <form onSubmit={handleSubmit}>
//               {/* Course Dropdown */}
//               <select
//                 value={form.courseId}
//                 onChange={(e) => setForm({ ...form, courseId: e.target.value })}
//                 className="border px-3 py-2 w-full rounded-md mb-4"
//                 required
//               >
//                 <option value="">Select course</option>
//                 {courses.map((c) => (
//                   <option key={c._id} value={c._id}>
//                     {c.title}
//                   </option>
//                 ))}
//               </select>

//               <input
//                 type="text"
//                 value={form.title}
//                 onChange={(e) => setForm({ ...form, title: e.target.value })}
//                 placeholder="Video title"
//                 className="border px-3 py-2 w-full rounded-md mb-4"
//                 required
//               />

//               <input
//                 type="text"
//                 value={form.playbackUrl}
//                 onChange={(e) =>
//                   setForm({ ...form, playbackUrl: e.target.value })
//                 }
//                 placeholder="Playback URL"
//                 className="border px-3 py-2 w-full rounded-md mb-4"
//                 required
//               />

//               <input
//                 type="text"
//                 value={form.posterUrl}
//                 onChange={(e) =>
//                   setForm({ ...form, posterUrl: e.target.value })
//                 }
//                 placeholder="Poster URL (optional)"
//                 className="border px-3 py-2 w-full rounded-md mb-4"
//               />

//               <input
//                 type="number"
//                 value={form.durationSec}
//                 onChange={(e) =>
//                   setForm({ ...form, durationSec: e.target.value })
//                 }
//                 placeholder="Duration (in sec)"
//                 className="border px-3 py-2 w-full rounded-md mb-4"
//                 required
//               />

//               <input
//                 type="number"
//                 value={form.orderIndex}
//                 onChange={(e) =>
//                   setForm({ ...form, orderIndex: e.target.value })
//                 }
//                 placeholder="Order Index"
//                 className="border px-3 py-2 w-full rounded-md mb-4"
//                 required
//               />

//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setOpen(false);
//                     setEditId(null);
//                     setForm({
//                       courseId: "",
//                       title: "",
//                       playbackUrl: "",
//                       posterUrl: "",
//                       durationSec: "",
//                       orderIndex: "",
//                     });
//                   }}
//                   className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-primary-500 text-white rounded-md"
//                 >
//                   {editId ? "Update" : "Add"}
//                 </button>
//               </div>
//             </form>
//           </DialogPanel>
//         </div>
//       </Dialog>
//     </>
//   );
// };

// export default VideoSettings;
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axios from "axios";
// import toast from "react-hot-toast";
import Toast from "@/components/ui/Toast";

interface Course {
  _id: string;
  title: string;
}

interface Video {
  _id: string;
  courseId: { _id: string; title: string };
  title: string;
  playbackUrl: string;
  posterUrl?: string;
  durationSec: number;
  orderIndex: number;
  createdBy: string;
}

const VideoSettings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [toast, setToast] = useState<null | { type: "success" | "error"; message: string }>(null);
  const [confirmOpen, setConfirmOpen] = useState<null | { id: string; title: string }>(null);
  const [loading, setLoading] = useState(false);
  // Form
  const [form, setForm] = useState({
    courseId: "",
    title: "",
    playbackUrl: "",
    posterUrl: "",
    durationSec: "",
    orderIndex: "",
  });

  // Data
  const [videos, setVideos] = useState<Video[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch videos
  const fetchVideos = async () => {
    try {
      const res = await axios.get(`/api/videos`);
      if (res.data.ok) {
        setVideos(res.data.data);
      }
    } catch (err) {
     // toast.error("Failed to fetch videos");
      setToast({ type: "error", message: "Failed to fetch videos" });
    }
  };

  // Fetch courses for dropdown
  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/courses");
      if (res.data.ok) setCourses(res.data.data || [] );
    } catch {
    //  toast.error("Failed to fetch courses");
      setToast({ type: "error", message: "Failed to fetch videos" });
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchCourses();
  }, []);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // basic validation
    if (!form.courseId || !form.title || !form.playbackUrl) {
    //  toast.error("Please fill required fields");
      setToast({ type: "error", message: "Please fill required fields" });
      return;
    }

    try {
      if (editId) {
        await axios.put(`/api/videos/${editId}`, {
          ...form,
          durationSec: Number(form.durationSec),
          orderIndex: Number(form.orderIndex),
        });
       // toast.success("Video updated");
        setToast({ type: "success", message: "Video updated" });
        setEditId(null);
      } else {
        await axios.post(`/api/videos`, {
          ...form,
          durationSec: Number(form.durationSec),
          orderIndex: Number(form.orderIndex),
          createdBy: "ADMIN001",
        });
     //   toast.success("Video added");
          setToast({ type: "success", message: "Video added" });
      }
      resetForm();
      setOpen(false);
      fetchVideos();
    } catch (err) {
   //   toast.error("Failed to save video");
      setToast({ type: "error", message: "Failed to save video" });
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      await axios.delete(`/api/videos/${id}`);
    //  toast.success("Video deleted");
       setToast({ type: "success", message: "Video deleted" });
      fetchVideos();
    } catch {
      setToast({ type: "error", message: "Failed to delete video" });
     // toast.error("Failed to delete video");
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      courseId: "",
      title: "",
      playbackUrl: "",
      posterUrl: "",
      durationSec: "",
      orderIndex: "",
    });
  };

  // Filter + Pagination
  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filtered.length;
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const display = filtered.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Videos</h5>
        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item">
            <Link
              href="/dashboard/"
              className="inline-block transition-all hover:text-primary-500"
            >
              Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item">System Settings</li>
          <li className="breadcrumb-item">Videos</li>
        </ol>
      </div>

      {/* Table Card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] sm:flex justify-between">
          {/* Search */}
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="absolute left-[13px] top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined">search</i>
              </label>
              <input
                type="text"
                placeholder="Search video..."
                className="bg-gray-50 border h-[36px] text-xs rounded-md w-full pl-[38px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
          {/* Add Button */}
          <button
            type="button"
            className="rounded-md px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
            onClick={() => setOpen(true)}
          >
            + Add New Video
          </button>
        </div>

        {/* Table */}
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-[20px] py-[11px] bg-primary-50">S.No</th>
                <th className="px-[20px] py-[11px] bg-primary-50">Course</th>
                <th className="px-[20px] py-[11px] bg-primary-50">Title</th>
                <th className="px-[20px] py-[11px] bg-primary-50">Duration</th>
                <th className="px-[20px] py-[11px] bg-primary-50">Order</th>
                <th className="px-[20px] py-[11px] bg-primary-50">Action</th>
              </tr>
            </thead>
            <tbody>
              {display.map((v, index) => (
                <tr key={v._id}>
                  <td className="px-[20px] py-[15px] border-b">{index + 1}</td>
                  <td className="px-[20px] py-[15px] border-b">{v.courseId?.title}</td>
                  <td className="px-[20px] py-[15px] border-b">{v.title}</td>
                  <td className="px-[20px] py-[15px] border-b">{v.durationSec} sec</td>
                  <td className="px-[20px] py-[15px] border-b">{v.orderIndex}</td>
                  <td className="px-[20px] py-[15px] border-b">
                    <button
                      className="text-blue-500 mr-2"
                      onClick={() => {
                        setEditId(v._id);
                        setForm({
                          courseId: v.courseId._id,
                          title: v.title,
                          playbackUrl: v.playbackUrl,
                          posterUrl: v.posterUrl || "",
                          durationSec: v.durationSec.toString(),
                          orderIndex: v.orderIndex.toString(),
                        });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDelete(v._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {display.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No videos found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-3">
          <p className="text-sm">
            Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total} results
          </p>
          <div>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-2 ${currentPage === i + 1 ? "font-bold" : ""}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center">
          <DialogPanel className="bg-white dark:bg-[#0c1427] p-6 rounded-md w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {editId ? "Edit Video" : "Add Video"}
            </h3>
            <form onSubmit={handleSubmit}>
              <select
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                className="border px-3 py-2 w-full rounded-md mb-4"
                required
              >
                <option value="">Select course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Video title"
                className="border px-3 py-2 w-full rounded-md mb-4"
                required
              />
              <input
                type="text"
                value={form.playbackUrl}
                onChange={(e) =>
                  setForm({ ...form, playbackUrl: e.target.value })
                }
                placeholder="Playback URL"
                className="border px-3 py-2 w-full rounded-md mb-4"
                required
              />
              <input
                type="text"
                value={form.posterUrl}
                onChange={(e) =>
                  setForm({ ...form, posterUrl: e.target.value })
                }
                placeholder="Poster URL (optional)"
                className="border px-3 py-2 w-full rounded-md mb-4"
              />
              <input
                type="number"
                value={form.durationSec}
                onChange={(e) =>
                  setForm({ ...form, durationSec: e.target.value })
                }
                placeholder="Duration (sec)"
                className="border px-3 py-2 w-full rounded-md mb-4"
                required
              />
              <input
                type="number"
                value={form.orderIndex}
                onChange={(e) =>
                  setForm({ ...form, orderIndex: e.target.value })
                }
                placeholder="Order Index"
                className="border px-3 py-2 w-full rounded-md mb-4"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditId(null);
                    resetForm();
                  }}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-md"
                >
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default VideoSettings;
