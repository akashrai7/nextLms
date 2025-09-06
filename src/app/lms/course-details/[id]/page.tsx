"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

interface Video {
  _id: string;
  title: string;
  playbackUrl: string;
  posterUrl?: string;
  durationSec: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  videos: Video[];
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function CourseDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}`);
        if (res.data.success && res.data.data) {
          const courseData: Course = res.data.data;
          setCourse(courseData);
          if (courseData.videos?.length > 0) {
            setCurrentVideo(courseData.videos[0]);
          }
        }
      } catch (err) {
        console.error("❌ Failed to fetch course details", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading course...</p>;
  if (!course) return <p className="text-center py-10">Course not found..</p>;

  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Course Details</h5>

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
            Course Details
          </li>
        </ol>
      </div>
    <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-3">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                <div className="trezo-card-title">
                  <h5 className="!mb-0">{course.title}</h5>
                </div>
              </div>
              <div className="trezo-card-content">
                <div className="flex items-center">
                  <img 
                    src="/images/events/event9.jpg"
                    alt="user-image"
                    className="rounded-full w-[100px]"
                    width={100}
                    height={100}
                  />
                  <div className="ltr:ml-[15px] rtl:mr-[15px]">
                    <span className="block text-black dark:text-white text-[17px] mb-[2px] font-medium">
                      {course.description}
                    </span>
                    <span className="block">{course.category}</span>
                  </div>
                </div>
                <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
                  Course Description
                </span>
                <p>
                  This course is designed for beginners who want to learn the
                  fundamentals of the Python programming language. The course covers
                  basic syntax, data types, control structures, and an introduction to
                  object-oriented programming. Participants will have hands-on coding
                  exercises to reinforce their learning.
                </p>
                <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
                  Course Schedule
                </span>
                <p>
                  Start Date: 01 August 2024
                  <br />
                  End Date: 30 December 2024
                </p>
                <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
                  Status
                </span>
                <p>
                  The course is currently in progress. Students are actively engaged
                  in the learning materials, and the instructor is providing guidance
                  and support.
                </p>
              </div>
            </div>
        </div>        
    

        <div className="lg:col-span-2">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                  <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                    <div className="trezo-card-title">
                      <h5 className="!mb-0">Course content</h5>
                    </div>
                  </div>
                  <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
                    <div className="table-responsive overflow-auto h-[426px]">
                      <table className="w-full">
                        <thead className="text-black dark:text-white">
                          <tr>
                            
                            <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                              Topic Name
                            </th>
                            <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                              Time Duration
                            </th>
                          </tr>
                        </thead>
          
                        <tbody className="text-black dark:text-white">
                        {course.videos && course.videos.length > 0 ? (
                            course.videos.map((video) => (  
                            <tr>
                              <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                                <div className="flex items-center">
                                  <img
                                    src="https://trezo-bs.envytheme.com/images/events/event7.jpg"
                                    className="inline-block rounded-full w-[44px]"
                                    alt="product-image"
                                    width={44}
                                    height={44}
                                  />
                                  <span className="font-medium inline-block ltr:ml-[12px] rtl:mr-[12px]">
                                    {video.title}
                                  </span>
                                </div>
                              </td>
          
                              <td className="text-gray-500 dark:text-gray-400 ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                               {formatDuration(video.durationSec)}
                              </td>
                            </tr>
                            ))
  ) : (
   
                            <tr>
                             
          
                              <td colSpan={2} className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                                <div className="flex items-center">
                                 
                                  <span className="font-medium inline-block ltr:ml-[12px] rtl:mr-[12px]">
                                    No Course content.
                                  </span>
                                </div>
                              </td>
          
                              
                            </tr>
                  
  )}           
                            
                            
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
        </div>
    </div>
    </>
  );
};
