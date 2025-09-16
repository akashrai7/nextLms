"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image"; 

export default function CourseAddForm() {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    description: "",
    demoVideo: "",
    certificate: "",
    language: "",
    instructor: "",
    videoSource: "",
    courseLevel: "",
    courseType: "",
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [certificateBase, setCertificateBase] = useState<File | null>(null);
  const [settings, setSettings] = useState<any>({});
  const [message, setMessage] = useState<string | null>(null);
  //const [form, setForm] = useState({ courseType: ""});
  const [courseType, setCourseType] = useState<string>("");
  // ✅ Input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // // ✅ Checkbox
  // const handleCheckboxChange = (value: string) => {
  //   setForm((prev) => {
  //     const exists = prev.courseType.includes(value);
  //     return {
  //       ...prev,
  //       courseType: exists
  //         ? prev.courseType.filter((v) => v !== value)
  //         : [...prev.courseType, value],
  //     };
  //   });
  // };

// RadioChange
const handleRadioChange = (value: string) => {
  setForm((prev) => ({
    ...prev,
    courseType: value,
  }));
};


  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else {
        formData.append(key, value);
      }
    });

    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (coverPhoto) formData.append("coverPhoto", coverPhoto);
    if (certificateBase) formData.append("certificateBase", certificateBase);
    if (courseType) formData.append("courseType", form.courseType);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Course created successfully!");
        setForm({
          title: "",
          summary: "",
          description: "",
          demoVideo: "",
          certificate: "",
          language: "",
          instructor: "",
          videoSource: "",
          courseLevel: "",
          courseType: "",
        });
        setThumbnail(null);
        setCoverPhoto(null);
        setCertificateBase(null);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Something went wrong");
    }
  };

  // ✅ Fetch settings (languages, instructors, courseLevels, videoSource)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [t, i, c, v] = await Promise.all([
          axios.get("/api/settings/training_language"),
          axios.get("/api/user?role=student"),
          axios.get("/api/settings/course_level"),
          axios.get("/api/settings/video_source"),
        ]);
        setSettings({
          languages: t.data.data,
          instructors: i.data.data,
          courseLevels: c.data.data,
          videoSources: v.data.data,
        });
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };
    fetchSettings();
  }, []);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
   <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
        
    <div className="trezo-card-title">
      <h4 className="text-2xl font-bold mb-6">Add New Course</h4>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-white ${
            message.startsWith("✅") ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Title */}
    <div className="lg:grid lg:grid-cols-12  sm:gap-[15px]">
      <div className="lg:col-span-12 font-bold">Course type</div>

      <div className="lg:col-span-4">
          <div>
      <div
  className={`relative flex items-center justify-center overflow-hidden rounded-md py-[65px] px-[20px] border cursor-pointer transition ${
    form.courseType === "Offline"
      ? "border-primary-200 ring-2 ring-primary-500 bg-primary-50 dark:bg-[#1a2a3c]"
      : "border-gray-200 dark:border-[#172036]"
  }`}
  onClick={() => handleRadioChange("Offline")}
>
              <div className="flex items-center justify-center">
                <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                  <i className="ri-upload-2-line"></i>
                </div>
                <p className="leading-[1.5]">
                  <strong className="text-black dark:text-white">
                    Basic Information
                  </strong>
                  <br /> Basic Information for your course 
                </p>
              </div>
              <input
                 type="radio"
                 checked={form.courseType === "Offline"}
                 onChange={() => handleRadioChange("Offline")}
                 className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer focus:outline-none focus:border-primary-500"
              />
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

      <div className="lg:col-span-4">
          <div
  className={`relative flex items-center justify-center overflow-hidden rounded-md py-[65px] px-[20px] border cursor-pointer transition ${
    form.courseType === "Online"
      ? "border-blue-200 ring-2 ring-primary-500 bg-primary-50 dark:bg-[#1a2a3c]"
      : "border-gray-200 dark:border-[#172036]"
  }`}
  onClick={() => handleRadioChange("Online")}
> <div className="flex items-center justify-center">
                <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                  <i className="ri-upload-2-line"></i>
                </div>
                <p className="leading-[1.5]">
                  <strong className="text-black dark:text-white">
                    Basic Information
                  </strong>
                  <br /> Basic Information for your course 
                </p>
              </div>
              <input
                 type="radio"
                 checked={form.courseType === "Online"}
                 onChange={() => handleRadioChange("Online")}
                 className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer focus:outline-none focus:border-primary-500"
              />
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

      <div className="lg:col-span-4">
            <div>
<div
  className={`relative flex items-center justify-center overflow-hidden rounded-md py-[65px] px-[20px] border cursor-pointer transition ${
    form.courseType === "Recorded"
      ? "border-primary-200 ring-2 ring-primary-500 bg-primary-50 dark:bg-[#1a2a3c]"
      : "border-gray-200 dark:border-[#172036]"
  }`}
  onClick={() => handleRadioChange("Recorded")}
>             
              <div className="flex items-center justify-center">
                <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                  <i className="ri-upload-2-line"></i>
                </div>
                <p className="leading-[1.5]">
                  <strong className="text-black dark:text-white">
                    Recorded Lectures
                  </strong>
                  <br /> Recorded Lectures for your course
                </p>
              </div>
              <input
                 type="radio"
                 checked={form.courseType === "Recorded"}
                 onChange={() => handleRadioChange("Recorded")}
                 className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer focus:outline-none focus:border-primary-500"
              />
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
      

    <div className="lg:col-span-12 font-bold">Basic Information</div>

      <div className="lg:col-span-12"> 
       <div className="mb-[20px] sm:mb-0">
        <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
            Course Title
          </label>
            <input
              type="text"
              name="title"
              placeholder="Course Title"
              value={form.title}
              onChange={handleChange}
              className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
              required
            />
        </div> 
       </div>  
      </div>

     <div className="lg:col-span-12">
        {/* Instructor */}
      <div className="mb-[20px] sm:mb-0">  
        <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
            Instructor
          </label>
          <select
            name="instructor"
            value={form.instructor}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          >
            <option value="">Select</option>
            {settings.instructors?.map((i: any) => (
              <option key={i._id} value={i._id}>
                {i.firstName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>  

    <div className="lg:col-span-12">
         {/* Language */}
      <div className="mb-[20px] sm:mb-0">  
        <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
            Language
          </label>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          >
            <option value="">Select</option>
            {settings.languages?.map((g: any) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>  

    <div className="lg:col-span-12 font-bold">Thumbnail & Cover (max 500KB)</div>  

    <div className="lg:col-span-3">
          {/* File Uploads */}
    <div className="mb-[10px] sm:mb-0">
     <div className="relative w-full">            
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[10px] md:p-[15px] rounded-md">
        <div className="trezo-card-content">
          <div id="fileUploader">
            <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[65px] px-[20px] border border-gray-200 dark:border-[#172036]">
              <div className="flex items-center justify-center">
                <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                  <i className="ri-upload-2-line"></i>
                </div>
                <p className="leading-[1.5]">
                  <strong className="text-black dark:text-white">
                    Thumbnail
                  </strong>
                  <br /> you file here
                </p>
              </div>
              
              <input
                 type="file"
                 accept="image/*"
                 className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer focus:outline-none focus:border-primary-500"
                 onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              />
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
        </div>
      </div>
     </div>  
    </div>
    </div> 

    <div className="lg:col-span-3">
    <div className="mb-[10px] sm:mb-0">
     <div className="relative w-full">            
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[10px] md:p-[15px] rounded-md">
        <div className="trezo-card-content">
          <div id="fileUploader">
            <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[65px] px-[20px] border border-gray-200 dark:border-[#172036]">
              <div className="flex items-center justify-center">
                <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                  <i className="ri-upload-2-line"></i>
                </div>
                <p className="leading-[1.5]">
                  <strong className="text-black dark:text-white">
                    Cover
                  </strong>
                  <br /> you file here
                </p>
              </div>
              
              <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverPhoto(e.target.files?.[0] || null)}
                  className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer focus:outline-none focus:border-primary-500"
              />
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
        </div>
      </div>
     </div>  
    </div>
    </div> 

    
    <div className="lg:col-span-3"></div>
    <div className="lg:col-span-3"></div>

    <div className="lg:col-span-12 font-bold">Demo Video</div>           

    <div className="lg:col-span-12">
      {/* Demo Video */}
      <div className="mb-[20px] sm:mb-0">
        <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
            Demo Video Link
          </label>
          <input
          type="text"
          name="demoVideo"
          placeholder="Demo Video Link"
          value={form.demoVideo}
          onChange={handleChange}
          className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
          
        />
        </div> 
      </div> 
    </div>

   <div className="lg:col-span-12 font-bold">Course Summary</div>  

    <div className="lg:col-span-12">
       {/* Summary */}
      <div className="mb-[20px] sm:mb-0">
        <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
            Course Summary
          </label>
            <textarea
          name="summary"
          placeholder="Course Summary"
          value={form.summary}
          onChange={handleChange}
          className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
          required
        />
        </div> 
      </div>       
    </div>

   <div className="lg:col-span-12 font-bold">Course Description</div> 
    <div className="lg:col-span-12">
        {/* Description */}
      <div className="mb-[20px] sm:mb-0">
        <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
            Description
          </label>
          <textarea
          name="description"
          placeholder="Course Description"
          value={form.description}
          onChange={handleChange}
          className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
          required
        />
        </div> 
      </div> 
    </div>

    <div className="lg:col-span-4">
         {/* course lavel */}
      <div className="mb-[20px] sm:mb-0">
        <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
            Course Level
          </label>
          <select
            name="courseLevel"
            value={form.courseLevel}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
          >
            <option value="">Select</option>
            {settings.courseLevels?.map((c: any) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div> 
      </div> 
    </div>
         
    <div className="lg:col-span-4">
         {/* video sourse*/}
      <div className="mb-[20px] sm:mb-0">
        <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
            Video Source
          </label>
          <select
            name="videoSource"
            value={form.videoSource}
            onChange={handleChange}
            className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg  focus:outline-none placeholder-gray-400 focus:border-primary-400"
          >
            <option value="">Select</option>
            {settings.videoSources?.map((v: any) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>    

    
        
    

 {/* Course Type */}
    {/* <div className="lg:col-span-12">
       
      <div className="mb-[20px] sm:mb-0">  
        <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
            Course Type
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.courseType.includes("Online")}
              onChange={() => handleCheckboxChange("Online")}
            />
            Online
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.courseType.includes("Offline")}
              onChange={() => handleCheckboxChange("Offline")}
            />
            Offline
          </label>
        </div>
      </div>
    </div>   */}

    <div className="lg:col-span-4">
        {/* Certificate */}
      <div className="mb-[20px] sm:mb-0">  
        <div className="relative w-full">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-500">
           Certificate
          </label>  
        <select
          name="certificate"
          value={form.certificate}
          onChange={handleChange}
          className="h-[55px] w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          >
          <option value="">Select</option>
          <option value="NO"> NO</option>
          <option value="YES"> YES</option>
        </select>
        </div>
      </div>
    </div> 

    
<div className="lg:col-span-12 font-bold">Certificate Base (max 5 MB)</div>
    
<div className="lg:col-span-4">
    <div className="mb-[10px] sm:mb-0">
     <div className="relative w-full">            
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[10px] md:p-[15px] rounded-md">
        <div className="trezo-card-content">
          <div id="fileUploader">
            <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[65px] px-[20px] border border-gray-200 dark:border-[#172036]">
              <div className="flex items-center justify-center">
                <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                  <i className="ri-upload-2-line"></i>
                </div>
                <p className="leading-[1.5]">
                  <strong className="text-black dark:text-white">
                    Certificate Base
                  </strong>
                  <br /> you file here
                </p>
              </div>
              
              <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCertificateBase(e.target.files?.[0] || null)}
                  className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer focus:outline-none focus:border-primary-500"
              />
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
        </div>
      </div>
     </div>  
    </div>        

    </div>
    
<div className="lg:col-span-4"></div>
<div className="lg:col-span-4"></div>           
      
    <div className="lg:col-span-12">
      <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Submit
      </button>
    </div>
      

    

      

       

        
    </div>    
      </form>
    </div>
    </div>
    </div>
  );
}
