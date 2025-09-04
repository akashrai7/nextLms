// import DarkMode from "@/components/Authentication/DarkMode"; 
// import SignUpForm from "@/components/Authentication/SignUpForm";


// export default function Page() {
//   return (
//     <>
//       <DarkMode />
      
//       <SignUpForm />
//     </>
//   );
// }
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import type { AxiosError } from "axios"; // सही तरीका (type import)

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      interface ApiResponse {
        ok: boolean;
        message?: string;
        errors?: Record<string, string[]>;
      }

      const res = await axios.post<ApiResponse>("/api/auth/register", form);
      setMessage({ type: "success", text: res.data.message || "Registration successful" });
    } catch (error) {
      const err = error as AxiosError<any>;

      if (err.response?.data?.errors) {
        // Flatten Zod validation errors into one string
        const allErrors = Object.values(err.response.data.errors)
          .flat()
          .filter(Boolean)
          .join(", ");
        setMessage({ type: "error", text: allErrors || "Invalid input" });
      } else {
        setMessage({
          type: "error",
          text: err.response?.data?.message || "Something went wrong",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[120px] xl:py-[135px]">
        <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
            <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-1">
              <Image
                src="/images/sign-up.jpg"
                alt="sign-up-image"
                className="rounded-[25px]"
                width={646}
                height={804}
              />
            </div>

            <div className="xl:ltr:pl-[90px] xl:rtl:pr-[90px] 2xl:ltr:pl-[120px] 2xl:rtl:pr-[120px] order-1 lg:order-2">
              <Image
                src="/images/logo.png"
                alt="logo"
                className="inline-block dark:hidden"
                width={142}
                height={38}
              />
              <Image
                src="/images/logo.png"
                alt="logo"
                className="hidden dark:inline-block"
                width={142}
                height={38}
              />

              <div className="my-[17px] md:my-[25px]">
                <h1 className="!font-semibold !text-[22px] md:!text-xl lg:!text-2xl !mb-[5px] md:!mb-[7px]">
                  Sign Up to User Dashboard
                </h1>
                <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400">
                  Sign Up with social account or enter your details
                </p>
              </div>

               {/* Message box */}
              {message && (
                <div
                  className={`mb-4 p-3 rounded ${
                    message.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}


             <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-[15px] relative">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  type="text"
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="Enter your First name"
                />
                
              </div>
              <div className="mb-[15px] relative">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="Enter your Last name"
                />
                
              </div>

              <div className="mb-[15px] relative">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  Email Address
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="example@gmail.com"
                />
                
              </div>
              <div className="mb-[15px] relative">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  Mobile 
                </label>
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  type="tel"
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="Enter your mobile number"
                />
              </div>

              <div className="mb-[15px] relative">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  DOB 
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="Enter your DOB"
                />
              </div>

              <div className="mb-[15px] relative">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  Role 
                </label>
                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
              </div>

              <div className="mb-[15px] relative" id="passwordHideShow">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  Password
                </label>
                <input
                  name="password" 
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  id="password"
                  placeholder="Type password"
                />
                <button
                  className="absolute text-lg ltr:right-[20px] rtl:left-[20px] bottom-[12px] transition-all hover:text-primary-500"
                  id="toggleButton"
                  type="button"
                >
                  <i className="ri-eye-off-line"></i>
                </button>
                
              </div>
              <div className="mb-[15px] relative" id="passwordHideShow">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword" 
                  value={form.confirmPassword}
                  onChange={handleChange}
                  type="text"
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  id="password"
                  placeholder="Type confirm password"
                />
               
              </div>
                {message && <p className={message.type}>{message.text}</p>}
              <button type="submit" className="md:text-md block w-full text-center transition-all rounded-md font-medium my-[20px] md:my-[25px] py-[12px] px-[25px] text-white bg-primary-500 hover:bg-primary-400"
               disabled={loading}>
                <span className="flex items-center justify-center gap-[5px]">
                 <i className="material-symbols-outlined">person_4</i>
                  {loading ? "Creating..." : "Register"}
                </span>
              </button>

             </form>  
           
              <p className="!leading-[1.6]">
                Already have an account.{" "}
                <Link
                  href="/authentication/sign-in"
                  className="text-primary-500 transition-all font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

