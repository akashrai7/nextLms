"use client";

 import Nav from "@/components/LMS/video/Nav";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { usePathname } from "next/navigation";



interface Chapter {
  _id: string;
  name: string;
  createdBy: string;
}

const ChapterSettings: React.FC = () => {
  
  // Form
  const [form, setForm] = useState({ name: "" });
  const [editId, setEditId] = useState<string | null>(null);

  // Table
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Chapters
  const fetchChapters = async () => {
    const res = await axios.get(`/api/settings/chapter`);
    if (res.data.ok) setChapters(res.data.data);
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`/api/settings/chapter/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(`/api/settings/chapter`, {
        ...form,
        createdBy: "ADMIN001", // ✅ यहाँ currentUser.registrationId आएगा
      });
    }
    setForm({ name: "" });
    
    fetchChapters();
  };

  // Delete
  const handleDelete = async (id: string) => {
    await axios.delete(`/api/settings/chapter/${id}`);
    fetchChapters();
  };

  // Filter + Pagination
  const filtered = chapters.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filtered.length;
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const display = filtered.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  
  const pathname = usePathname();
  // const courseId = pathname.split("/").pop();
  const segments = pathname.split("/").filter(Boolean); // empty string hata do
  const courseId = segments[segments.length - 1]; // last part hamesha ID hoga

     

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

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] shadow rounded-2xl">
        <div className="trezo-card-content">
          <Nav /> 
{/* start Nav */}
  {/* <ul className="mb-[10px]">
        <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href="/lms/video-settings/"
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === "/lms/video-settings/" ? "bg-primary-500 text-white" : ""
            }`}
          >
            Video Chapter
          </Link>
        </li>

        <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href="/lms/video-settings/video-title/"
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === "/lms/video-settings/video-title/"
                ? "bg-primary-500 text-white"
                : ""
            }`}
          >
            Video Title
          </Link>
        </li>

         <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href="/lms/video-settings/video-link"
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === "/lms/video-settings/video-link/"
                ? "bg-primary-500 text-white"
                : ""
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
      </ul> */}
{/* end Nav */}
          
     
          {/* Form */}
              
                
                 
                 
                  <div className="lg:grid lg:grid-cols-12  sm:gap-[15px]">
                    <div className="lg:col-span-4 font-bold">
                      <h5 className="text-lg font-medium mb-4">
                        {editId ? "Edit Chapter" : "Add Chapter"}
                      </h5>
                    </div>
                    <div className="lg:col-span-8 font-bold">
                      <h5 className="text-lg font-medium mb-4">
                        View Chapters
                      </h5>
                    </div>
                    <div className="lg:col-span-4">
                    <form onSubmit={handleSubmit}>
                      <div className="relative w-full">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                          Course Title
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Enter Chapter"
                          className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
                          required
                        />
                      </div> 
                    <div className="flex justify-end py-[20px]">
                      <button
                       type="submit"
                       className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                      >
                       {editId ? "Update" : "Add"}
                     </button>
                   </div>
                    </form>
                    </div>
                  
                  <div className="lg:col-span-8">
                    {/* Table */}
          <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white">
              <tr>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    S.No
                  </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Name
                  </th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Created By</th>
                <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                    Action</th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-white">
             
              {display.map((g, index) => (
                <tr key={g._id}>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">{ index + 1 }</td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">{g.name}</td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">{g.createdBy}</td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    {/* <button
                      className="text-blue-500 mr-2"
                      onClick={() => {
                        setEditId(g._id);
                        setForm({ name: g.name });
                        setOpen(true);
                      }}
                    >
                      
                      Edit
                    </button> */}
                    <button
                      className="text-red-500"
                      onClick={() => handleDelete(g._id)}
                    >
                      {/* <i className="material-symbols-outlined !text-md">
                        delete
                      </i> */}
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {display.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No Chapters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
                  </div> 
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
      </div>
    </>
  );
}
export default ChapterSettings;