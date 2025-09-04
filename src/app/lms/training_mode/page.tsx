"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axios from "axios";

interface Training_mode {
  _id: string;
  name: string;
  createdBy: string;
}

const Training_modeSettings: React.FC = () => {
  // Modal
  const [open, setOpen] = useState(false);

  // Form
  const [form, setForm] = useState({ name: "" });
  const [editId, setEditId] = useState<string | null>(null);

  // Table
  const [training_modes, setTraining_modes] = useState<Training_mode[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch Training_modes
  const fetchTraining_modes = async () => {
    const res = await axios.get(`/api/settings/training_mode`);
    if (res.data.ok) setTraining_modes(res.data.data);
  };

  useEffect(() => {
    fetchTraining_modes();
  }, []);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`/api/settings/training_mode/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(`/api/settings/training_mode`, {
        ...form,
        createdBy: "ADMIN001", // ✅ यहाँ currentUser.registrationId आएगा
      });
    }
    setForm({ name: "" });
    setOpen(false);
    fetchTraining_modes();
  };

  // Delete
  const handleDelete = async (id: string) => {
    await axios.delete(`/api/settings/training_mode/${id}`);
    fetchTraining_modes();
  };

  // Filter + Pagination
  const filtered = training_modes.filter((g) =>
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

  return (
    <>
      {/* Page Header */}
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Training modes</h5>

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
            System Settings 
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Training modes
          </li>
        </ol>
      </div>

      {/* Table Card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          {/* Search */}
          <div className="trezo-card-title">
          <form className="relative sm:w-[265px]">
            <label className="absolute ltr:left-[13px] rtl:right-[13px] top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined">search</i>
            </label>
            <input
              type="text"
              placeholder="Search training mode..."
              className="bg-gray-50 border h-[36px] text-xs rounded-md w-full block pl-[38px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
          {/* Add Button */}
                <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
                  <button
                    type="button"
                    className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
                    onClick={() => setOpen(true)}
                  >
                    <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                      <i className="material-symbols-outlined !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2">
                        add
                      </i>
                      Add New Training mode
                    </span>
                  </button>
                </div>

        </div>

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
                    <button
                      className="text-blue-500 mr-2"
                      onClick={() => {
                        setEditId(g._id);
                        setForm({ name: g.name });
                        setOpen(true);
                      }}
                    >
                      {/* <i className="material-symbols-outlined !text-md">
                        edit
                      </i> */}
                      Edit
                    </button>
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
                    No Training modes found.
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
              {editId ? "Edit Training mode" : "Add Training mode"}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter Training mode"
                className="border px-3 py-2 w-full rounded-md mb-4"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditId(null);
                    setForm({ name: "" });
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

export default Training_modeSettings;
