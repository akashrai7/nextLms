"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image"; 

export default function ProfilePage() {
  const [form, setForm] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dob: "",
    address: "",
    city: "",
    pinCode: "",
    gender: "",
    nationality: "",
    bloodGroup: "",
    category: "",
    state: "",
    district: "",
    photo: null,
  });

  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );

  // ✅ Load current user profile
  useEffect(() => {
    axios.get("/api/auth/me").then((res) => {
      if (res.data.ok) {
        setForm((prev: any) => ({
          ...prev,
          ...res.data.data,
        }));
      }
    });
  }, []);

  // ✅ Fetch settings (gender, category, bloodGroup, nationality, states)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [g, c, b, n, s] = await Promise.all([
          axios.get("/api/settings/gender"),
          axios.get("/api/settings/category"),
          axios.get("/api/settings/blood_group"),
          axios.get("/api/settings/nationality"),
          axios.get("/api/settings/state"),
        ]);
        setSettings({
          genders: g.data.data,
          categories: c.data.data,
          bloodGroups: b.data.data,
          nationalities: n.data.data,
          state: s.data.data,
        });
        setStates(s.data.data);
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };
    fetchSettings();
  }, []);

  // ✅ Fetch districts on state change
  useEffect(() => {
    if (form.state) {
      axios
        .get(`/api/settings/district?stateId=${form.state}`)
        .then((res) => setDistricts(res.data.data))
        .catch(() => setDistricts([]));
    }
  }, [form.state]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, photo: reader.result });
      };
      reader.readAsDataURL(file);
      setSelectedImages([file]);
    }
  };

const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setForm({ ...form, photo: null });
  };

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await axios.put("/api/user/profile/update", form);
      if (res.data.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Update failed",
      });
    }
  };



  return (
    <>
      <form onSubmit={ handleSubmit }>
        <h5 className="!text-lg !mb-[6px]">Profile</h5>
        <p className="mb-[20px] md:mb-[25px]">
          Update your photo and personal details here.
        </p>

        <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
          <div className="mb-[20px] sm:mb-0">
            <div className="relative w-full">
              <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                disabled
                placeholder="Insert first name"
                className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
              />
            </div>
          </div>
          <div className="mb-[20px] sm:mb-0">
            <div className="relative w-full">
              <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                disabled
                placeholder="Insert last name"
                className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
              />
            </div>
          </div>
          <div className="mb-[20px] sm:mb-0">
            <div className="relative w-full">
              <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                disabled
                placeholder="Insert email address"
                className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="mb-[20px] sm:mb-0">
            <div className="relative w-full">
              <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile || ""}
                onChange={handleChange}
                placeholder="Insert mobile number"
                className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="mb-[20px] sm:mb-0">
            <div className="relative w-full">
              <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                Date Of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={form.dob || ""}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="mb-[20px] sm:mb-0">
            <div className="relative w-full">
              <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
                Address
              </label>
              <input
                type="text"
                name="address"
                onChange={handleChange}
                placeholder="Insert address"
                className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="mb-[20px] sm:mb-0">
            <div className="relative w-full">
            <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
              Country
            </label>
            <select
                name="country"
                value="India"
                disabled
                className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none placeholder-gray-400 focus:border-primary-500"
              >
                <option value="India">India</option>
              </select>
            </div>
          </div>

          <div className="mb-[20px] sm:mb-0">
            <div className="relative w-full">
            <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
              State
            </label>
            <select
                name="state"
                value={form.state || ""}
                onChange={handleChange}
                className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none placeholder-gray-400 focus:border-primary-500"
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

          <div className="mb-[20px] sm:mb-0">
            <div className="relative w-full">
            <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
              District
            </label>
            <select
                name="district"
                value={form.district || ""}
                onChange={handleChange}
                className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none placeholder-gray-400 focus:border-primary-500"
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

          <div className="mb-[20px] sm:mb-0">
            <div className="relative w-full">
            <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
              City
            </label>
            <input
                type="text"
                name="city"
                value={form.city || ""}
                onChange={handleChange}
                placeholder="Enter city"
                className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none placeholder-gray-400 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="mb-[20px] sm:mb-0">
            <div className="relative w-full">
            <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
              Pin Code
            </label>
             <input
                type="text"
                name="pinCode"
                value={form.pinCode || ""}
                onChange={handleChange}
                placeholder="Enter pin code"
                className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none placeholder-gray-400 focus:border-primary-500"
              />
            </div>
          </div>
          

          <div className="mb-[20px] sm:mb-0">
            <div className="relative w-full">
            <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
              Gender
            </label>
            <select
                name="gender"
                value={form.gender || ""}
                onChange={handleChange}
                className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none placeholder-gray-400 focus:border-primary-500"
              >
                <option value="">Select</option>
                {settings.genders?.map((g: any) => (
                  <option key={g._id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-[20px] sm:mb-0">
            <div className="relative w-full">
            <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
              Nationality
            </label>
            <select
                name="nationality"
                value={form.nationality || ""}
                onChange={handleChange}
                className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none placeholder-gray-400 focus:border-primary-500"
              >
                <option value="">Select</option>
                {settings.nationalities?.map((n: any) => (
                  <option key={n._id} value={n.name}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-[20px] sm:mb-0">
            <div className="relative w-full">
            <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
              Blood Group
            </label>
            <select
                name="bloodGroup"
                value={form.bloodGroup || ""}
                onChange={handleChange}
                className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none placeholder-gray-400 focus:border-primary-500"
              >
                <option value="">Select</option>
                {settings.bloodGroups?.map((b: any) => (
                  <option key={b._id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

         

          <div className="sm:col-span-2 mb-[20px] sm:mb-0">
            <label className="mb-[10px] text-black dark:text-white font-medium block">
              Add Your Bio
            </label>
           <textarea
            name="bio"
            value={form.bio || ""}
            onChange={handleChange}
            className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
            placeholder="It makes me feel..."
          ></textarea>
          </div>
        </div>

        <h5 className="!text-lg !mb-[6px] !mt-[20px] md:!mt-[25px]">Profile</h5>
        <p className="mb-[20px] md:mb-[25px]">
          This will be displayed on your profile.
        </p>

        <div id="fileUploader">
          <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[88px] px-[20px] border border-gray-200 dark:border-[#172036]">
            <div className="flex items-center justify-center">
              <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                <i className="ri-upload-2-line"></i>
              </div>
              <p className="leading-[1.5]">
                <strong className="text-black dark:text-white">
                  Click to upload
                </strong>
                <br /> you file here
              </p>
            </div>
           
          </div>

          {/* Image Previews */}
          <div className="mt-[10px] flex flex-wrap gap-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative w-[50px] h-[50px]">
                <Image
                  src={URL.createObjectURL(image)}
                  alt="product-preview"
                  width={50}
                  height={50}
                  className="rounded-md"
                />
                <button
                  type="button"
                  className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs rtl:right-auto rtl:left-[-5px]"
                  onClick={() => handleRemoveImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

      

        <div className="mt-[20px] md:mt-[25px]">
          <button
            type="button"
            className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
          >
            Cancel
          </button>

          <button
             type="submit"
            className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
          >
            <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
              <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                check
              </i>
              Update Profile
            </span>
          </button>
        </div>
      </form>
    </>
  );
};

