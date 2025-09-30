"use client";
import { useState, useEffect } from "react";

interface InstituteFormProps {
  defaultValues?: any;
  onSubmitSuccess?: () => void;
}

export default function InstituteForm({ defaultValues, onSubmitSuccess }: InstituteFormProps) {
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
      computerLab: "No",
      computerCount: "",
      schoolRegCertificate: null,
      institutePAN: null,
    }
  );

  const [errors, setErrors] = useState<any>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 🔹 Dropdown data
  const [instituteTypes, setInstituteTypes] = useState<any[]>([]);
  const [affiliationBoards, setAffiliationBoards] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  // 🔹 Fetch Dropdown Data from APIs
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [typesRes, boardsRes, statesRes] = await Promise.all([
          fetch("/api/settings/institute_type").then((r) => r.json()),
          fetch("/api/settings/affiliation_board").then((r) => r.json()),
          fetch("/api/settings/state").then((r) => r.json()),
        ]);
        setInstituteTypes(typesRes.data || []);
        setAffiliationBoards(boardsRes.data || []);
        setStates(statesRes.data || []);
      } catch (err) {
        console.error("Failed to load dropdowns", err);
      }
    };
    fetchDropdowns();
  }, []);

  // 🔹 Fetch Districts when State changes
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

  // 🔹 Handle Input Change
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

  // 🔹 Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      const res = await fetch("/api/institute", {
        method: defaultValues ? "PUT" : "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Institute saved successfully!");
        onSubmitSuccess && onSubmitSuccess();
      } else {
        setErrorMsg(data.message || "Something went wrong");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-xl font-bold">{defaultValues ? "Edit Institute" : "Add Institute"}</h2>

      {/* Institute Name */}
      <div>
        <label className="block text-sm font-medium">Institute Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Institute Type</label>
          <select
            name="instituteType"
            value={form.instituteType}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
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

        <div>
          <label className="block text-sm font-medium">Affiliation Board</label>
          <select
            name="affiliationBoard"
            value={form.affiliationBoard}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
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

      {/* State & District */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">State</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
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

        <div>
          <label className="block text-sm font-medium">District</label>
          <select
            name="district"
            value={form.district}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
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

      {/* File Uploads */}
      <div>
        <label className="block text-sm font-medium">School Registration Certificate</label>
        <input type="file" name="schoolRegCertificate" onChange={handleChange} />
        {errors.schoolRegCertificate && (
          <p className="text-red-500 text-sm">{errors.schoolRegCertificate}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Institute PAN</label>
        <input type="file" name="institutePAN" onChange={handleChange} />
        {errors.institutePAN && (
          <p className="text-red-500 text-sm">{errors.institutePAN}</p>
        )}
      </div>

      {/* Messages */}
      {successMsg && <p className="text-green-600">{successMsg}</p>}
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      {/* Submit */}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
        {defaultValues ? "Update" : "Save"}
      </button>
    </form>
  );
}
