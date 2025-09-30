"use client";
import { useState, useEffect } from "react";

interface InstituteFormProps {
  defaultValues?: any;
  onSubmitSuccess?: () => void;
}

export default function InstituteForm({
  defaultValues,
  onSubmitSuccess,
}: InstituteFormProps) {
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
  const [trainingLanguageBoards, setTrainingLanguageBoards] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [typesRes, boardsRes, modeRes, langRes, statesRes] = await Promise.all([
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

      const res = await fetch("/api/institute", {
        method: defaultValues ? "PUT" : "POST",
        body: formData,
      });

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
        // ✅ Fixed ESLint no-unused-expressions
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
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
      className="p-6 bg-white rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-xl font-bold">
        {defaultValues ? "Edit Institute" : "Add Institute"}
      </h2>

      {/* Messages */}
      
      {successMsg && <p className="text-green-600">{successMsg}</p>}
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      
    <div className="grid grid-cols-2 gap-4"> 
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
    </div>

    <div className="grid grid-cols-2 gap-4"> 
      {/* School Code */}
      <div>
        <label className="block text-sm font-medium">School Code (optional)</label>
        <input
          type="text"
          name="schoolCode"
          value={form.schoolCode}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Principal Name */}
      <div>
        <label className="block text-sm font-medium">Principal Name</label>
        <input
          type="text"
          name="principalName"
          value={form.principalName}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
      </div>
    </div>
      {/* Contact Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Official Mobile</label>
          <input
            type="text"
            name="officialMobile"
            value={form.officialMobile}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Alternate Mobile (optional)
          </label>
          <input
            type="text"
            name="alternateMobile"
            value={form.alternateMobile}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">  
        {/* official Email */}
      <div>
        <label className="block text-sm font-medium">official Email</label>
        <input
          type="email"
          name="officialEmail"
          value={form.officialEmail}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

       {/* institutePhone */}
      <div>
        <label className="block text-sm font-medium">Tnstitute Phone</label>
        <input
          type="text"
          name="institutePhone"
          value={form.institutePhone}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div> 
    </div>

    <div className="grid grid-cols-2 gap-4"> 
 {/* official Website */}
      <div>
        <label className="block text-sm font-medium">official Website</label>
        <input
          type="text"
          name="officialWebsite"
          value={form.officialWebsite}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div> 

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

      {/* Address */}
      <div>
        <label className="block text-sm font-medium">Full Address</label>
        <textarea
          name="fullAddress"
          value={form.fullAddress}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        ></textarea>
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
<div className="grid grid-cols-2 gap-4">
        {/* City */}
      <div>
        <label className="block text-sm font-medium">City</label>
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div> 

       {/* Pin Code */}
      <div>
        <label className="block text-sm font-medium">Pin Code</label>
        <input
          type="text"
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
      </div>

</div>

      {/* Training Mode & Language */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Training Mode</label>
          <select
            name="trainingMode"
            value={form.trainingMode}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
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
        <div>
          <label className="block text-sm font-medium">Training Language</label>
          <select
            name="trainingLanguage"
            value={form.trainingLanguage}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
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

      {/* Computer Lab */}
      <div>
        <label className="block text-sm font-medium">Computer Lab</label>
        <div className="flex gap-4">
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
          <input
            type="number"
            name="computerCount"
            value={form.computerCount}
            onChange={handleChange}
            placeholder="Number of Computers"
            className="w-full border rounded-lg p-2 mt-2"
          />
        )}
      </div>

      {/* File Uploads */}
      <div>
        <label className="block text-sm font-medium">
          School Registration Certificate
        </label>
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

      {/* Submit */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        {defaultValues ? "Update" : "Save"}
      </button>
    </form>
  );
}
