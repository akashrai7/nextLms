// "use client";

// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useParams } from "next/navigation";
// import axios from "axios";

// interface Video {
//   _id: string;
//   title: string;
//   playbackUrl: string;
//   posterUrl?: string;
//   durationSec: number;
// }

// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   category: string;
//   videos: Video[];
// }

// export default function CourseDetailPage() {
//   const { id } = useParams();
//   const [course, setCourse] = useState<Course | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

//   // Fetch course + videos
//   const fetchCourse = async () => {
//     try {
//       const res = await axios.get(`/api/courses/${id}`);
//       console.log("📡 API Response:", res.data); // ✅ Debug log

//       if (res.data.success && res.data.data) {
//         const courseData: Course = res.data.data;
//         setCourse(courseData);

//         if (courseData.videos && courseData.videos.length > 0) {
//           setCurrentVideo(courseData.videos[0]); // auto play first video
//         }
//       }
//     } catch (error) {
//       console.error("❌ Failed to fetch course details", error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
// useEffect(() => {
//     fetchCourse();
//   }, [id]);

//   if (loading) return <p className="text-center py-10">Loading course...</p>;
//   if (!course) return <p className="text-center py-10">Course not found..</p>;
  


//   return (
//      <>   {/* bg-white */}
     
//       <div className="auth-main-content bg-white  dark:bg-[#0a0e19] px-[10px] py-[10px] md:py-[10px] lg:px-[40px] lg:py-[40px]"> 
//        <div className="lg:grid lg:grid-cols-12 gap-[25px]">
//         <div className="lg:col-span-8">
//           
//         </div>
//         <div className="lg:col-span-3">
//             {/* Left Playlist */}
//               <div className="lg:col-span-1 bg-white dark:bg-[#0c1427] shadow  p-4">
//                 <h4 className="text-lg font-semibold mb-4">Course content</h4>
//                   <ul className="space-y-2">
//                     {course.videos && course.videos.length > 0 ? (
//                        course.videos.map((video) => (
//                         <li key={video._id}>
//                           <button
//                             onClick={() => setCurrentVideo(video)}
//                             className={`w-full text-left px-3 py-2 rounded-md ${
//                             currentVideo?._id === video._id
//                             ? "bg-primary-500 text-white"
//                             : "bg-gray-100 dark:bg-gray-800"
//                           }`}
//                           >
//                           {video.title}
//                           </button>
//                         </li>
//                          ))
//                         )   : (
//                         <li className="text-gray-500">No videos in playlist.</li>
//                         )}
//                   </ul>

//               </div>
//         </div>
//       </div>


//       </div>
//     </>
//   );
// };

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
//import BasicTabs from "@/components/UIElements/Tabs/BasicTabs";




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

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

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
  <div className="auth-main-content   dark:bg-[#0a0e19] px-[10px] py-[10px] md:py-[10px] lg:px-[40px] lg:py-[40px]"> 
    
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
      {/* start */}
      <div className="lg:grid lg:grid-cols-12 gap-[25px]">
        <div className="lg:col-span-1">
          
        </div>
        <div className="lg:col-span-9">
          <div className="trezo-card  dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                <div className="trezo-card-title">
                  <h3 className="!mb-0">{course.title}</h3>
                </div>
              </div>
              <div className="trezo-card-content">
                {/* <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
                  Course Description
                </span> */}
                <p className="justify">
                  {course.description}
                </p>
               
            <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
              {/* Rating */}
              <i className="ri-star-fill text-yellow-400"></i> 4.5/5.0 &nbsp;  &nbsp;

              {/* Users Enrolled */}
              <i className="ri-shield-user-line text-orange-500 bg-orange-100"></i> 12k Enrolled &nbsp;  &nbsp;

              {/* Level */}
              <i className="ri-bar-chart-grouped-line text-green-500"></i> All levels &nbsp;  &nbsp;

              {/* Language */}
              <i className="ri-global-line text-blue-500"></i> English &nbsp; 
            </span>

              </div>
            </div>
        </div>      
        <div className="lg:col-span-2">
          
        </div>  
      </div>

      <div className="lg:grid lg:grid-cols-12 gap-[25px]">
        <div className="lg:col-span-1">
          
        </div>
        <div className="lg:col-span-8">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[15px] p-[15px] md:p-[25px] ">
            {currentVideo ? (
           <>
             {/* <p className="text-xl  font-bold mb-5">{course.title}</p> */}
             {/* <p className="text-sm text-white mb-4">{course.description}</p> */}

             <video
               key={currentVideo._id}
               src={currentVideo.playbackUrl}
               poster={currentVideo.posterUrl}
               controls
               preload="metadata"
               playsInline
               className="w-full  bg-black"
            />

            <p className="mt-4 text-lg  font-semibold">
              Now Playing: {currentVideo.title}
            </p>
            <p className="text-sm ">
              Duration: {Math.floor(currentVideo.durationSec / 60)}m{" "}
              {currentVideo.durationSec % 60}s
            </p>
           </>
          ) : (
             <p>No videos available for this course.</p>
          )}
          </div>
        </div>
         <div className="lg:col-span-3">
         
         
<div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
                  <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                    <div className="trezo-card-title">
                      <h5 className="!mb-0">Course content</h5>
                    </div>
                  </div>
                  <div className="trezo-card-content -mx-[20px] md:-mx-[25px]">
                    <div className="table-responsive overflow-auto h-[426px]">
                      <div className="trezo-card-content">
                        <ul className="list-group">
                          <form>
                          {course.videos && course.videos.length > 0 ? (
                            course.videos.map((video) => ( 
                                //  {formatDuration(video.durationSec)}
                              <li key={video._id}  className="list-group-item ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                                <input type="checkbox" value="" id="thirdCheckbox" className="form-check-input me-2"/>
                                <label htmlFor="thirdCheckbox" className="form-check-label"> {video.title} </label>
                              </li>
                               
                            ))
                          ) : (
   
                              <li className="list-group-item ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                                <label htmlFor="secondCheckbox" className="form-check-label">No course Content</label>
                              </li>
                            )}   
                            </form>        
                        </ul>
                      </div> 
                   </div>
                  </div>
          </div>


        <div className="lg:col-span-1">
          
        </div>  
        </div>   
    </div>
      {/*end  */}
    <div className="lg:grid lg:grid-cols-12 gap-[25px]" >
      <div className="lg:col-span-1">
          
      </div>
        <div className="lg:col-span-10">
            <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
                  <div className="trezo-card-content">
                    <div className="trezo-tabs" id="trezo-tabs">
                      <ul className="navs mb-[20px] border-b border-gray-100 dark:border-[#172036]">
                        <li className="nav-item inline-block ltr:mr-[20px] rtl:ml-[20px]">
                          <button
                            type="button"
                            onClick={() => handleTabClick(0)}
                            className={`nav-link block pb-[8px] transition-all relative font-medium ${
                              activeTab === 0 ? "active" : ""
                            }`}
                          >
                            Overview
                          </button>
                        </li>
          
                        <li className="nav-item inline-block ltr:mr-[20px] rtl:ml-[20px]">
                          <button
                            type="button"
                            onClick={() => handleTabClick(1)}
                            className={`nav-link block pb-[8px] transition-all relative font-medium ${
                              activeTab === 1 ? "active" : ""
                            }`}
                          >
                            Curriculum
                          </button>
                        </li>
          
                        <li className="nav-item inline-block ltr:mr-[20px] rtl:ml-[20px]">
                          <button
                            type="button"
                            onClick={() => handleTabClick(2)}
                            className={`nav-link block pb-[8px] transition-all relative font-medium ${
                              activeTab === 2 ? "active" : ""
                            }`}
                          >
                            Instructor
                          </button>
                        </li>
                      </ul>
          
                      <div>
                        {activeTab === 0 && (
                          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              
              <div className="trezo-card-content">
                <h4> 
                <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
                  Course Description
                </span>
                </h4>
                <p className="justify-between">Artificial Intelligence (AI) is no longer science fiction 
                — it&apos;s part of our homes, phones, workplaces, and even entertainment. 
                But what exactly is AI? How does it compare with human intelligence?
                 And where do we already encounter it in daily life?</p>
<p className="justify-between">Everyday AI: Understanding the Basics (Level 1) is a beginner-friendly, 
interactive course that introduces you to the fascinating world of AI.
Through real-life examples, simple challenges, storytelling, 
and hands-on activities, you’ll uncover what AI is, how it has evolved,
 and why it matters in the modern world.</p>
<p className="justify-between"> This course is the first step in your AI learning journey and is designed for absolute beginners
 — no coding or prior technical knowledge required.</p>
               
                  <h4>
                <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
                  Who This Course Is For
                </span>
                </h4>
                <div className="space-y-3">
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Students and young learners curious about AI</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Teachers & educators seeking a structured way to introduce AI in classrooms</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Professionals exploring AI for the first time</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Anyone who wants to understand AI in simple, practical terms</span>
  </div>
  
</div>
</div>
          
          </div>
                        )}
          
                        {activeTab === 1 && (
                          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              
              <div className="trezo-card-content">
                <h4> 
                <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
                  Course Highlights
                </span>
                </h4> 
                <div className="space-y-3">
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Beginner-friendly explanations — no coding needed</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span> Interactive games, quizzes, and challenges</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Real-life examples from apps, entertainment, and smart devices</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Hands-on mini-projects (AI labeling, Teachable Machine)</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Creative activities (posters, reflection exercises, storytelling)</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Capstone project with gallery-style showcase</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span> Prepares you for Level 2 and Level 3 AI learning</span>
  </div>
<br></br>
              <h4> 
                <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
                  Assessments & Projects
                </span>
              </h4>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Short quizzes and polls</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Creative poster-making and brainstorming sessions</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Interactive debates & challenges</span>
  </div>
 <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Mini hands-on project with Teachable Machine</span>
  </div>
   <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Final Capstone Showcase</span>
  </div>
</div>
</div>
         </div>
                        )}
          
                        {activeTab === 2 && (
                          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              
              <div className="trezo-card-content">
                <h4> 
                <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
                Mr. Akshay Jain
                </span>
                </h4>
                
                {/* <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                <div className="trezo-card-title">
                  <h5 className="!mb-0">{course.title}</h5>
                </div>
              </div> */}
              <div className="trezo-card-content">
                <div className="flex items-center">
                  <Image  key="video._id"
                    src="/images/blue-man.jpg"
                    alt="user-image"
                    className="rounded-full w-[100px]"
                    width={100}
                    height={100}
                  />
                  <div className="ltr:ml-[15px] rtl:mr-[15px]">
                    <span className="block text-black dark:text-white text-[17px] mb-[2px] font-medium">
                      Academy of Administration & Management
                    </span>
                    <span className="block">Bhopal</span>
                  </div>
                </div>
              </div>

              </div>
          
          </div>
                        )}
                      </div>
                    </div>
                  </div>
            </div>
        </div> 
      <div className="lg:col-span-1">
          
      </div>       
    </div>


  </div>   
    </>
  );
};


