"use client";

import React from "react"; 
import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav: React.FC = () => {
  const pathname = usePathname();

  return (
    <>
      <ul className="mb-[10px]">
        <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href="/lms/video-settings/"
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === "/lms/video-settings/" ? "bg-primary-500 text-white" : ""
            }`}
          >
            Video Chapter
          </Link>
        </li>

        <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href="/lms/video-settings/video-title/"
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === "/lms/video-settings/video-title/"
                ? "bg-primary-500 text-white"
                : ""
            }`}
          >
            Video Title
          </Link>
        </li>

         <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href="/lms/video-settings/video-link"
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === "/lms/video-settings/video-link/"
                ? "bg-primary-500 text-white"
                : ""
            }`}
          >
            Video link
          </Link>
        </li>
        <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
          <Link
            href="/lms/video-settings/edit-course-details"
            className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
              pathname === "/lms/video-settings/edit-course-details/"
                ? "bg-primary-500 text-white"
                : ""
            }`}
          >
           Edit Course Details
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Nav;
