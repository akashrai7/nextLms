// "use client";

// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
// import axios from "axios";

// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   category: string;
//   createdBy: string;
// }

// const CourseSettings: React.FC = () => {
//   // Modal
//   const [open, setOpen] = useState(false);

//   // Form
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     category: "",
//   });
//   const [editId, setEditId] = useState<string | null>(null);

//   // Table
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Fetch courses
//   const fetchCourses = async () => {
//   try {
//     const res = await axios.get(`/api/courses`);
//    // console.log("API Response 👉", res.data); 
//     setCourses(res.data.data || res.data);
//   } catch (err) {
//     console.error("Fetch error 👉", err);
//   }
// };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // Submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editId) {
//       await axios.put(`/api/courses/${editId}`, form);
//       setEditId(null);
//     } else {
//       await axios.post(`/api/courses`, {
//         ...form,
//         createdBy: "ADMIN001", // ✅ yahan currentUser.registrationId aayega
//       });
//     }
//     setForm({ title: "", description: "", category: "" });
//     setOpen(false);
//     fetchCourses();
//   };

//   // Delete
//   const handleDelete = async (id: string) => {
//     await axios.delete(`/api/courses/${id}`);
//     fetchCourses();
//   };

//   // Filter + Pagination
//   const filtered = courses.filter((c) =>
//     c.title.toLowerCase().includes(searchTerm.toLowerCase())
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
//         <h5 className="!mb-0">Courses</h5>

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
//           <li className="breadcrumb-item">Courses</li>
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
//                 placeholder="Search course..."
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
//               + Add New Course
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="table-responsive overflow-x-auto">
//           <table className="w-full">
//             <thead className="text-black dark:text-white">
//               <tr>
//                 <th className="px-[20px] py-[11px] bg-primary-50">S.No</th>
//                 <th className="px-[20px] py-[11px] bg-primary-50">Title</th>
//                 <th className="px-[20px] py-[11px] bg-primary-50">Description</th>
//                 <th className="px-[20px] py-[11px] bg-primary-50">Category</th>
//                 <th className="px-[20px] py-[11px] bg-primary-50">Created By</th>
//                 <th className="px-[20px] py-[11px] bg-primary-50">Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-black dark:text-white">
//               {display.map((c, index) => (
//                 <tr key={c._id}>
//                   <td className="px-[20px] py-[15px] border-b">{index + 1}</td>
//                   {/* <td className="px-[20px] py-[15px] border-b">
//                     <Link
//                     href={`/lms/videos/${c._id}`}>{c.title}
//                     </Link>
//                   </td> */}
//                  <td className="px-[20px] py-[15px] border-b">{c.title}</td>
//                   <td className="px-[20px] py-[15px] border-b">{c.description}</td>
//                   <td className="px-[20px] py-[15px] border-b">{c.category}</td>
//                   <td className="px-[20px] py-[15px] border-b">{c.createdBy}</td>
//                   <td className="px-[20px] py-[15px] border-b">
//                     <button
//                       className="text-blue-500 mr-2"
//                       onClick={() => {
//                         setEditId(c._id);
//                         setForm({
//                           title: c.title,
//                           description: c.description,
//                           category: c.category,
//                         });
//                         setOpen(true);
//                       }}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="text-red-500"
//                       onClick={() => handleDelete(c._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {display.length === 0 && (
//                 <tr>
//                   <td colSpan={5} className="text-center py-4 text-gray-500">
//                     No courses found.
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
//               {editId ? "Edit Course" : "Add Course"}
//             </h3>
//             <form onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 value={form.title}
//                 onChange={(e) => setForm({ ...form, title: e.target.value })}
//                 placeholder="Enter title"
//                 className="border px-3 py-2 w-full rounded-md mb-4"
//                 required
//               />
//               <textarea
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//                 placeholder="Enter description"
//                 className="border px-3 py-2 w-full rounded-md mb-4"
//               />
//               <input
//                 type="text"
//                 value={form.category}
//                 onChange={(e) => setForm({ ...form, category: e.target.value })}
//                 placeholder="Enter category"
//                 className="border px-3 py-2 w-full rounded-md mb-4"
//                 required
//               />
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setOpen(false);
//                     setEditId(null);
//                     setForm({ title: "", description: "", category: "" });
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

// export default CourseSettings;

"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axios from "axios";
import Toast from "@/components/ui/Toast";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  createdBy: string;
}

type FormState = {
  title: string;
  description: string;
  category: string;
};

const initialForm: FormState = { title: "", description: "", category: "" };

export default function CourseSettings() {
  // UI states
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState<null | { id: string; title: string }>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<null | { type: "success" | "error"; message: string }>(null);

  // form + validation
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [editId, setEditId] = useState<string | null>(null);

  // table
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const validate = (data: FormState) => {
    const e: Partial<FormState> = {};
    if (!data.title?.trim()) e.title = "Title is required";
    if (!data.category?.trim()) e.category = "Category is required";
    if (data.description && data.description.length > 500)
      e.description = "Description must be ≤ 500 chars";
    return e;
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setEditId(null);
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`/api/courses`);
      if (res.data?.success || res.data?.ok) {
        setCourses(res.data.data ?? res.data.courses ?? []);
      } else {
        setToast({ type: "error", message: "Failed to load courses" });
      }
    } catch (err: any) {
      setToast({ type: "error", message: err?.response?.data?.message || "Error loading courses" });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Submit (create / update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      if (editId) {
        await axios.put(`/api/courses/${editId}`, form);
        setToast({ type: "success", message: "Course updated" });
      } else {
        await axios.post(`/api/courses`, {
          ...form,
          createdBy: "ADMIN001", // <- aapka current user id/registrationId
        });
        setToast({ type: "success", message: "Course created" });
      }
      setOpen(false);
      resetForm();
      await fetchCourses();
    } catch (err: any) {
      setToast({ type: "error", message: err?.response?.data?.message || "Save failed" });
    } finally {
      setLoading(false);
    }
  };

  // Delete (with confirm)
  const confirmDelete = (c: Course) => setConfirmOpen({ id: c._id, title: c.title });

  const handleDelete = async () => {
    if (!confirmOpen) return;
    setLoading(true);
    try {
      await axios.delete(`/api/courses/${confirmOpen.id}`);
      setToast({ type: "success", message: "Course deleted" });
      await fetchCourses();
    } catch (err: any) {
      setToast({ type: "error", message: err?.response?.data?.message || "Delete failed" });
    } finally {
      setLoading(false);
      setConfirmOpen(null);
    }
  };

  // Filter + pagination
  const filtered = useMemo(
    () =>
      courses.filter((c) => c.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [courses, searchTerm]
  );
  const total = filtered.length;
  const totalPages = Math.ceil(Math.max(total, 1) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const display = filtered.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      {/* header */}
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Courses</h5>
        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item">
            <Link href="/dashboard/" className="hover:text-primary-500">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">System Settings</li>
          <li className="breadcrumb-item">Courses</li>
        </ol>
      </div>

      {/* card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
              <label className="absolute ltr:left-[13px] top-1/2 -translate-y-1/2">
                <i className="material-symbols-outlined">search</i>
              </label>
              <input
                type="text"
                placeholder="Search course..."
                className="bg-gray-50 border h-[36px] text-xs rounded-md w-full block pl-[38px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
            <button
              type="button"
              className="inline-block rounded-md px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
              onClick={() => { resetForm(); setOpen(true); }}
            >
              + Add New Course
            </button>
          </div>
        </div>

        {/* table */}
        <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="px-[20px] py-[11px] bg-primary-50">S.No</th>
                <th className="px-[20px] py-[11px] bg-primary-50">Title</th>
                <th className="px-[20px] py-[11px] bg-primary-50">Category</th>
                <th className="px-[20px] py-[11px] bg-primary-50">Created By</th>
                <th className="px-[20px] py-[11px] bg-primary-50">Action</th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
              {display.map((c, index) => (
                <tr key={c._id}>
                  <td className="px-[20px] py-[15px] border-b">{startIndex + index + 1}</td>
                  <td className="px-[20px] py-[15px] border-b">{c.title}</td>
                  <td className="px-[20px] py-[15px] border-b">{c.category}</td>
                  <td className="px-[20px] py-[15px] border-b">{c.createdBy}</td>
                  <td className="px-[20px] py-[15px] border-b">
                    <button
                      className="text-blue-500 mr-3"
                      onClick={() => {
                        setEditId(c._id);
                        setForm({
                          title: c.title,
                          description: c.description || "",
                          category: c.category || "",
                        });
                        setErrors({});
                        setOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button className="text-red-500" onClick={() => confirmDelete(c)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {display.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="flex justify-between items-center mt-3">
          <p className="text-sm">
            Showing {total ? startIndex + 1 : 0} to {Math.min(endIndex, total)} of {total} results
          </p>
          <div>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-2">
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

      {/* create/edit modal */}
      <Dialog open={open} onClose={() => !loading && setOpen(false)} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white dark:bg-[#0c1427] p-6 rounded-md w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">{editId ? "Edit Course" : "Add Course"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter title"
                  className={`border px-3 py-2 w-full rounded-md ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
              </div>

              <div>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter description (optional)"
                  className={`border px-3 py-2 w-full rounded-md ${errors.description ? "border-red-500" : ""}`}
                  rows={3}
                />
                {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
              </div>

              <div>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Enter category"
                  className={`border px-3 py-2 w-full rounded-md ${errors.category ? "border-red-500" : ""}`}
                />
                {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { if (!loading) { setOpen(false); resetForm(); } }}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md text-white ${loading ? "bg-gray-400" : "bg-primary-500 hover:bg-primary-600"}`}
                  disabled={loading}
                >
                  {loading ? "Saving..." : editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>

      {/* confirm delete modal */}
      <Dialog open={!!confirmOpen} onClose={() => !loading && setConfirmOpen(null)} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white dark:bg-[#0c1427] p-6 rounded-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Delete Course?</h3>
            <p className="text-sm mb-6">
              This will also delete all videos under <b>{confirmOpen?.title}</b>. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 rounded-md" onClick={() => setConfirmOpen(null)} disabled={loading}>
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-md text-white ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* toast */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </>
  );
}
