"use client";

import React, { useEffect, useState } from "react";

type MasterOption = {
  _id: string;
  name: string;
};

type Student = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dob?: string;
  currentClass?: MasterOption | null;
  academicSession?: MasterOption | null;
  nationality?: MasterOption | null;
  registrationId?: string;
};

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    class: "",
    session: "",
    search: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    classes: [] as MasterOption[],
    sessions: [] as MasterOption[],
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // 🟢 Fetch filter dropdown options
  async function fetchFilterOptions() {
    try {
      const res = await fetch("/api/students/filters");
      const data = await res.json();
      console.log("🔹 Filter API Response:", data);

      if (data.success) {
        setFilterOptions({
          classes: data.classes,
          sessions: data.sessions,
        });
      }
    } catch (err) {
      console.error("Error fetching filter options:", err);
    }
  }

  // 🟢 Fetch students list with filters
  async function fetchStudents(page = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pagination.limit),
        class: filters.class,
        session: filters.session,
        search: filters.search,
      });

      const res = await fetch(`/api/students/list?${params.toString()}`);
      const data = await res.json();
      console.log("🔹 Students API Response:", data);

      if (data.success) {
        setStudents(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchStudents(1);
  }, [filters]);

  // 🧹 Reset filters
  const resetFilters = () => {
    setFilters({ class: "", session: "", search: "" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Students List</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, email, or mobile"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border p-2 rounded"
        />

        {/* Class Filter */}
        <select
          className="border p-2 rounded"
          value={filters.class}
          onChange={(e) => setFilters({ ...filters, class: e.target.value })}
        >
          <option value="">All Classes</option>
          {filterOptions.classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        {/* Academic Session Filter */}
        <select
          className="border p-2 rounded"
          value={filters.session}
          onChange={(e) => setFilters({ ...filters, session: e.target.value })}
        >
          <option value="">All Sessions</option>
          {filterOptions.sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <div className="mb-4">
        <button
          onClick={resetFilters}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Reset Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Mobile</th>
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Session</th>
              <th className="p-2 border">Nationality</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="p-2 border">{s.email}</td>
                  <td className="p-2 border">{s.mobile}</td>
                  <td className="p-2 border">
                    {s.currentClass?.name || "-"}
                  </td>
                  <td className="p-2 border">
                    {s.academicSession?.name || "-"}
                  </td>
                  <td className="p-2 border">
                    {s.nationality?.name || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  {loading ? "Loading..." : "No students found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={pagination.page === 1 || loading}
          onClick={() => fetchStudents(pagination.page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {pagination.page} of {pagination.pages || 1}
        </span>

        <button
          disabled={pagination.page === pagination.pages || loading}
          onClick={() => fetchStudents(pagination.page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
