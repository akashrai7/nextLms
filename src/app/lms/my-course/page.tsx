"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/courses");
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (error) {
      console.error("❌ Failed to fetch courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <p className="text-center py-10">Loading courses...</p>;

  return (

    <div className="p-6">
       <div className="mb-[25px] md:flex items-center justify-between">
              <h5 className="!mb-0">Courses</h5>
      
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
                  Education 
                </li>
      
                <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
                  Courses
                </li>
              </ol>
            </div>

      {courses.length === 0 ? (
        <p className="text-gray-500">No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[25px] mb-[25px]">
          {courses.map((course) => (
      
                <div
                   key={course._id}
                  className="trezo-card bg-white dark:bg-[#0c1427]  md:p-[0px] rounded-md"
                >
                  <div className="trezo-card-content">
                    <div className="relative mb-[2px]">
                      <Link href={`/lms/course-details/${course._id}`} className="block rounded-md" target="_blank">
                        {/* src={course.thumbnailUrl} */}
                      <img
                          key={course._id}
                          src="https://trezo-bs.envytheme.com/images/events/event9.jpg"
                          alt="event-image"
                          className="rounded-md "
                          width={700}
                          height={467}/>
                       </Link>
      
                      <div className="absolute bg-primary-500 top-0 text-white font-bold flex items-center justify-center ltr:right-0 rtl:left-0 text-md w-[60px] h-[60px] rounded-md z-[1]">
                        10th
                      </div>
                      <div className="absolute top-0 ltr:right-0 rtl:left-0 w-[65px] h-[65px] bg-white dark:bg-[#0a0e19] ltr:rounded-bl-md rtl:rounded-br-md"></div>
                    </div>
      <div className="p-[20px]">
                    <h6 className="!text-lg !mb-[10px]">
                      <Link
                       key={course._id}
                        href={`/lms/my-course/${course._id}`}
                        className="text-black dark:text-white transition-all hover:text-primary-500"
                      >
                        {course.title}
                      </Link>
                    </h6>
      {/* {course.category} */}
                    <p>Course Description Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      
                    <div className="flex items-center">
                      
                        <img
                          src="https://trezo-bs.envytheme.com/images/users/user26.jpg"
                          alt="user-image"
                          className="rounded-full w-[40px] h-[40px] ltr:-mr-[12px] rtl:-ml-[12px] ltr:last:mr-0 rtl:last:ml-0 border-[2px] border-gray-100 dark:border-[#172036]"
                          width={40}
                          height={40}
                        />
                         <img
                          src="https://trezo-bs.envytheme.com/images/users/user27.jpg"
                          alt="user-image"
                          className="rounded-full w-[40px] h-[40px] ltr:-mr-[12px] rtl:-ml-[12px] ltr:last:mr-0 rtl:last:ml-0 border-[2px] border-gray-100 dark:border-[#172036]"
                          width={40}
                          height={40}
                        />
                     
                    </div>
      
                    <div className="mt-[20px]">
                      <div className="flex items-center justify-between mb-[8px]">
                        <span className="block">Complete</span>
                        <span className="block font-semibold text-black dark:text-white">
                          75%
                        </span>
                      </div>
      
                      <div className="flex w-full h-[4px] overflow-hidden rounded-md bg-primary-50 dark:bg-[#172036]">
                        <div
                          className="flex flex-col justify-center overflow-hidden bg-primary-500 rounded-md"
                          // style={{
                          //   width: `${(3454 / 4000) * 100}%`,
                          // }}
                          style={{ width:`75%`}}
                        ></div>
                      </div>
                    </div>
      </div>
                  </div>
                </div>
             
      
                        ))}
        </div>
      )}
    </div>
  );
}

