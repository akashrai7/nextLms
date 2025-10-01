"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// ----------------- Institute Page -----------------
export default function InstitutePage() {
  const [institutes, setInstitutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Pagination + Search
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstitute, setEditingInstitute] = useState<any | null>(null);

  // 🔹 Fetch all institutes
  const fetchInstitutes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/institute");
      const data = await res.json();
      if (data.success) {
        setInstitutes(data.data || []);
      } else {
        setErrorMsg(data.message || "Failed to load institutes");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInstitutes();
  }, []);

  // 🔹 Delete Institute
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this institute?")) return;
    try {
      const res = await fetch(`/api/institute/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Deleted successfully");
        fetchInstitutes();
      } else {
        setErrorMsg(data.message || "Delete failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // 🔹 Filter + Pagination
  const filteredData = institutes.filter(
    (inst) =>
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.city?.toLowerCase().includes(search.toLowerCase()) ||
      inst.principalName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
<>
     {/* Page Header */}
          <div className="mb-[25px] md:flex items-center justify-between">
            <h5 className="!mb-0">Institute</h5>
    
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
                Institute
              </li>
            </ol>
          </div>


   <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md shadow-sm">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
      {/* Success & Error */}
      {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}

      

        {/* Search */}
         <div className="trezo-card-title">
            <form className="relative sm:w-[265px]">
            <label className="absolute ltr:left-[13px] rtl:right-[13px] top-1/2 -translate-y-1/2">
              <i className="material-symbols-outlined">search</i>
            </label>
        <input
          type="text"
          placeholder="Search by name, city, principal..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-gray-50 border h-[36px] text-xs rounded-md w-full block pl-[38px]"
        />
            </form>
         </div>

        {/* Add Button */}
                <div className="trezo-card-subtitle mt-[15px] sm:mt-0">
        <button
          onClick={() => {
            setEditingInstitute(null);
            setIsModalOpen(true);
          }}
          className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
        >
          + Add Institute
        </button>
                </div>
        
      </div>
      

      {/* Table */}
      <div className="table-responsive overflow-x-auto">
          <table className="w-full">
            <thead className="text-black dark:text-white">
            <tr>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">#</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">Name</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">Principal</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">Phone</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">City</th>
              <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="text-black dark:text-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((inst, idx) => (
                <tr key={inst._id}>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">{inst.name}</td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">{inst.principalName}</td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">{inst.officialMobile}</td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">{inst.city}</td>
                  <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036] space-x-2">
                    <button
                      onClick={() => {
                        setEditingInstitute(inst);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    {/* <button
                      onClick={() => handleDelete(inst._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === idx + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

    </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 shadow-lg rounded-md">
          <div className="bg-white p-6 rounded-lg  w-11/12 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-bold">
                {editingInstitute ? "Edit Institute" : "Add Institute"}
              </h5>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>
            <InstituteForm
              defaultValues={editingInstitute}
              onSubmitSuccess={() => {
                setIsModalOpen(false);
                fetchInstitutes();
              }}
            />
          </div>
        </div>
      )}
    
</>    
  );
}

// ----------------- Institute Form -----------------
function InstituteForm({
  defaultValues,
  onSubmitSuccess,
}: {
  defaultValues?: any;
  onSubmitSuccess?: () => void;
}) {
  const [form, setForm] = useState<any>(
    defaultValues || {
      name: "",
      schoolCode: "",
      instituteType: "",
      affiliationBoard: "",
      principalName: "",
      officialMobile: "",
      alternateMobile: "",
      officialEmail: "",
      institutePhone: "",
      officialWebsite: "",
      fullAddress: "",
      city: "",
      state: "",
      district: "",
      pincode: "",
      trainingMode: "",
      trainingLanguage: "",
      computerLab: defaultValues?.computerLab || "No",
      computerCount: defaultValues?.computerCount || "",
      schoolRegCertificate: null,
      institutePAN: null,
    }
  );

  const [errors, setErrors] = useState<any>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [instituteTypes, setInstituteTypes] = useState<any[]>([]);
  const [affiliationBoards, setAffiliationBoards] = useState<any[]>([]);
  const [trainingModeBoards, setTrainingModeBoards] = useState<any[]>([]);
  const [trainingLanguageBoards, setTrainingLanguageBoards] = useState<any[]>(
    []
  );
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [typesRes, boardsRes, modeRes, langRes, statesRes] =
          await Promise.all([
            fetch("/api/settings/institute_type").then((r) => r.json()),
            fetch("/api/settings/affiliation_board").then((r) => r.json()),
            fetch("/api/settings/training_mode").then((r) => r.json()),
            fetch("/api/settings/training_language").then((r) => r.json()),
            fetch("/api/settings/state").then((r) => r.json()),
          ]);

        setInstituteTypes(typesRes.data || []);
        setAffiliationBoards(boardsRes.data || []);
        setTrainingModeBoards(modeRes.data || []);
        setTrainingLanguageBoards(langRes.data || []);
        setStates(statesRes.data || []);
      } catch (err) {
        console.error("Failed to load dropdowns", err);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (!form.state) return;
    const fetchDistricts = async () => {
      try {
        const res = await fetch(`/api/settings/district?state=${form.state}`);
        const data = await res.json();
        setDistricts(data.data || []);
      } catch (err) {
        console.error("Failed to load districts", err);
      }
    };
    fetchDistricts();
  }, [form.state]);

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (file && file.size > 200 * 1024) {
        setErrors((prev: any) => ({
          ...prev,
          [name]: "File size must be under 200KB",
        }));
        return;
      }
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
      setForm({ ...form, [name]: file });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      const res = await fetch(
        defaultValues ? `/api/institute/${defaultValues._id}` : "/api/institute",
        {
          method: defaultValues ? "PUT" : "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Institute saved successfully!");
        if (!defaultValues) {
          setForm({
            name: "",
            schoolCode: "",
            instituteType: "",
            affiliationBoard: "",
            principalName: "",
            officialMobile: "",
            alternateMobile: "",
            officialEmail: "",
            institutePhone: "",
            officialWebsite: "",
            fullAddress: "",
            city: "",
            state: "",
            district: "",
            pincode: "",
            trainingMode: "",
            trainingLanguage: "",
            computerLab: "No",
            computerCount: "",
            schoolRegCertificate: null,
            institutePAN: null,
          });
        }
        if (onSubmitSuccess) onSubmitSuccess();
      } else {
        setErrorMsg(data.message || "Something went wrong");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white space-y-6"
    >
      {successMsg && <p className="text-green-600">{successMsg}</p>}
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      {/* ---- All Fields ---- */}
      <div className="grid grid-cols-2 gap-4">
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">Institute Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
            required
          />
          </div>
        </div>
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">School Code</label>
          <input
            type="text"
            name="schoolCode"
            value={form.schoolCode}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
          />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">Principal Name</label>
          <input
            type="text"
            name="principalName"
            value={form.principalName}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
            required
          />
          </div>
        </div>
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">Official Mobile</label>
          <input
            type="text"
            name="officialMobile"
            value={form.officialMobile}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
            required
          />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">Alternate Mobile</label>
          <input
            type="text"
            name="alternateMobile"
            value={form.alternateMobile}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
          />
          </div>
        </div>
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">Official Email</label>
          <input
            type="email"
            name="officialEmail"
            value={form.officialEmail}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
          />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">Institute Phone</label>
          <input
            type="text"
            name="institutePhone"
            value={form.institutePhone}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
          />
          </div>
        </div>
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">Website</label>
          <input
            type="text"
            name="officialWebsite"
            value={form.officialWebsite}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
          />
          </div>
        </div>
      </div>

      <div>
        <div className="relative w-full">
        <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">Full Address</label>
        <textarea
          name="fullAddress"
          value={form.fullAddress}
          onChange={handleChange}
          className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
        />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
          />
          </div>
        </div>
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
          />
          </div>
        </div>
      </div>

      {/* State & District */}
      <div className="grid grid-cols-2 gap-4">
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">State</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
            required
          >
            <option value="">Select</option>
            {states.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          </div>
        </div>
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">District</label>
          <select
            name="district"
            value={form.district}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
          >
            <option value="">Select</option>
            {districts.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
          </div>
        </div>
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-4">
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">Institute Type</label>
          <select
            name="instituteType"
            value={form.instituteType}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
            required
          >
            <option value="">Select</option>
            {instituteTypes.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
          </div>
        </div>
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">Affiliation Board</label>
          <select
            name="affiliationBoard"
            value={form.affiliationBoard}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
            required
          >
            <option value="">Select</option>
            {affiliationBoards.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">Training Mode</label>
          <select
            name="trainingMode"
            value={form.trainingMode}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
            required
          >
            <option value="">Select</option>
            {trainingModeBoards.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
          </div>
        </div>
        <div>
            <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">Training Language</label>
          <select
            name="trainingLanguage"
            value={form.trainingLanguage}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
            required
          >
            <option value="">Select</option>
            {trainingLanguageBoards.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
          </div>
        </div>
      </div>

      {/* Computer Lab */}
      <div>
        <label className=" px-1 text-sm text-gray-500">Computer Lab</label>
        <div className="flex gap-4 p-[10px]">
          {["Yes", "No", "Partial"].map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name="computerLab"
                value={opt}
                checked={form.computerLab === opt}
                onChange={handleChange}
              />
              {opt}
            </label>
          ))}
        </div>
        {form.computerLab === "Yes" && (
            <div className="relative w-full">
                 <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">Number of Computers</label>
          <input
            type="number"
            name="computerCount"
            value={form.computerCount}
            onChange={handleChange}
            placeholder="Number of Computers"
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
          />
          </div>
        )}
      </div>

      {/* File Uploads */}
      <div>
        <label className="left-3 bg-white px-1 text-sm text-gray-500">
          School Registration Certificate
        </label>
        <input type="file" name="schoolRegCertificate" onChange={handleChange} />
        {errors.schoolRegCertificate && (
          <p className="text-red-500 text-sm">{errors.schoolRegCertificate}</p>
        )}
      </div>

      <div>
        <label className="left-3 bg-white px-1 text-sm text-gray-500">Institute PAN</label>
        <input type="file" name="institutePAN" onChange={handleChange} />
        {errors.institutePAN && (
          <p className="text-red-500 text-sm">{errors.institutePAN}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          {defaultValues ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}
