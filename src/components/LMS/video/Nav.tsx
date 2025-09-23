"use client";

import React from "react"; 
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const courseId = segments[segments.length - 1]; // 👈 last slug hamesha ID hoga

  if (!courseId) {
    return <div>Invalid course</div>;
  }

  return (
    <>
     {/* start Nav */}
      <ul className="mb-[10px]">
             <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
               <Link
                 href={`/lms/video-settings/video-chapter/${courseId}`}
                 className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
                   pathname === `/lms/video-settings/video-chapter/${courseId}/` 
                   ? "bg-primary-500 text-white" : ""
                 }`}
               >
                 Video Chapter
               </Link>
             </li>
     
             <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
               <Link
                 href={`/lms/video-settings/video-title/${courseId}`}
                 className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
                   pathname === `/lms/video-settings/video-title/${courseId}/`
                     ? "bg-primary-500 text-white" : ""
                 }`}
               >
                 Video Title
               </Link>
             </li>
     
              <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
               <Link
                 href={`/lms/video-settings/video-link/${courseId}`}
                 className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
                   pathname === `/lms/video-settings/video-link/${courseId}/`
                     ? "bg-primary-500 text-white" : ""
                 }`}
               >
                 Video link
               </Link>
             </li>
             <li className="inline-block mb-[15px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0">
               <Link
                 href={`/lms/video-settings/${courseId}`}
                 className={`block rounded-md font-medium py-[8.5px] px-[15px] text-primary-500 border border-primary-500 transition-all  ${
                   pathname === `/lms/video-settings/${courseId}/`
                     ? "bg-primary-500 text-white"
                     : ""
                 }`}
               >
                Edit Course Details..
               </Link>
             </li>
           </ul>
     {/* end Nav */}
    </>
  );
};


