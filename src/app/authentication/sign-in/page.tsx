"use client";

import Image from "next/image";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ Import router

export default function LoginPage() {
  const router = useRouter(); // ✅ initialize router
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
   
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          provider: "google",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed..");

      setMessage({ type: "success", text: data.message });
      // ✅ Success पर redirect
    
        if (data.data.role === "admin") {
          router.push("/dashboard");  // /admin/dashboard
        } else if (data.data.role === "teacher") {
          router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="auth-main-content bg-white dark:bg-[#0a0e19] py-[60px] md:py-[80px] lg:py-[135px]">
        <div className="mx-auto px-[12.5px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1255px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] items-center">
            <div className="xl:ltr:-mr-[25px] xl:rtl:-ml-[25px] 2xl:ltr:-mr-[45px] 2xl:rtl:-ml-[45px] rounded-[25px] order-2 lg:order-1">
              <Image
                src="/images/sign-in.jpg"
                alt="sign-in-image"
                className="rounded-[25px]"
                width={636}
                height={790}
              />
            </div>

            <div className="xl:ltr:pl-[90px] xl:rtl:pr-[90px] 2xl:ltr:pl-[120px] 2xl:rtl:pr-[120px] order-1 lg:order-2">
              <Image
                src="/images/logo.png"
                alt="logo"
                className="inline-block dark:hidden"
                width={172}
                height={48}
              />
              <Image
                src="/images/logo.png"
                alt="logo"
                className="hidden dark:inline-block"
                width={172}
                height={48}
              />

              <div className="my-[17px] md:my-[25px]">
                <h1 className="!font-semibold !text-[22px] md:!text-xl lg:!text-2xl !mb-[5px] md:!mb-[7px]">
                  Welcome back to User!
                </h1>
                <p className="font-medium lg:text-md text-[#445164] dark:text-gray-400">
                  Sign In with social account or enter your details
                </p>
              </div>
      {message && (
        <div className={message.type === "success" ? "text-green-500" : "text-red-500"}>
          {message.text}
        </div>
      )}
             
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-[15px] relative">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  Email Address
                </label>
                <input
                  name="identifier"
                  value={form.identifier}
                  onChange={handleChange}
                  type="text"
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  placeholder="example@gmail.com"
                  
                />
              </div>

              <div className="mb-[15px] relative" id="passwordHideShow">
                <label className="mb-[10px] md:mb-[12px] text-black dark:text-white font-medium block">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                  id="password"
                  placeholder="Type password"
                />
              
                
              </div>
           
              <Link
                href="/authentication/forgot-password"
                className="inline-block text-primary-500 transition-all font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
                <button
                type="submit"
                disabled={loading}
                className="md:text-md block w-full text-center transition-all rounded-md font-medium mt-[20px] md:mt-[25px] py-[12px] px-[25px] text-white bg-primary-500 hover:bg-primary-400"
                >
                  <span className="flex items-center justify-center gap-[5px]">
                    <i className="material-symbols-outlined">login</i>
                {loading ? "Logging in..." : "Login"}
                </span>
                </button>

 </form>
              <p className="mt-[15px] md:mt-[20px]">
                Don’t have an account.{" "}
                <Link
                  href="/authentication/sign-up"
                  className="text-primary-500 transition-all font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


