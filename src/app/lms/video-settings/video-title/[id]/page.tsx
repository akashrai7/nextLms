"use client";

import React from "react";
import Nav from "@/components/LMS/video/Nav";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Video Title</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard/ecommerce/"
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

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Video Title
          </li>
        </ol>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-content">
          <Nav />
          
           <form>
                  <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
                    <div className="mb-[20px] sm:mb-0 relative" id="passwordHideShow">
                      <label className="mb-[10px] text-black dark:text-white font-medium block">
                        Chapter
                      </label>
                      <input
                        type="password"
                        className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        id="password"
                        placeholder="Type password"
                      />
                    </div>
          
                    <div className="mb-[20px] sm:mb-0 relative" id="passwordHideShow2">
                      <label className="mb-[10px] text-black dark:text-white font-medium block">
                        Video Title
                      </label>
                      <input
                        type="password"
                        className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        id="password2"
                        placeholder="Type password"
                      />
                    </div>
          
                    <div
                      className="sm:col-span-2 mb-[20px] sm:mb-0 relative"
                      id="passwordHideShow3"
                    >
                      <label className="mb-[10px] text-black dark:text-white font-medium block">
                        Video Link
                      </label>
                      <input
                        type="password"
                        className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                        id="password3"
                        placeholder="Type password"
                      />
                    </div>
                  </div>
          
                  <div className="mt-[20px] md:mt-[25px]">
                    <button
                      type="button"
                      className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
                    >
                      <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                        <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                          check
                        </i>
                        Change Password
                      </span>
                    </button>
                    
                    <Link
                      href="/authentication/forgot-password/"
                      className="inline-block text-danger-500 ltr:ml-[23px] rtl:mr-[23px]"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </form>
        </div>
      </div>
    </>
  );
}
