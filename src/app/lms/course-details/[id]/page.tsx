"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
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
      </div>

      <div className="lg:grid lg:grid-cols-12 gap-[25px]">
        <div className="lg:col-span-7">
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
                  <img  key="video._id"
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
         
         <div className="lg:col-span-3">
          <div className="trezo-card bg-white dark:bg-[#0c1427]  md:p-[0px] rounded-md" >
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
                                  L1
                                </div>
                                <div className="absolute top-0 ltr:right-0 rtl:left-0 w-[65px] h-[65px] bg-white dark:bg-[#0a0e19] ltr:rounded-bl-md rtl:rounded-br-md"></div>
                 </div>
                            <div className="p-[20px]">
                              <h6 className="!text-lg !mb-[10px]">
                                 {/* href={`/lms/my-course/${course._id}`} */}
                                <Link
                                 key={course._id}
                                 href={`/lms/course-details/${course._id}`}
                                 
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
          <br></br>
          <div className="trezo-card bg-white dark:bg-[#0c1427] gap-[25px] md:p-[0px] rounded-md" >
              <div className="trezo-card-content">
                <div className="trezo-card bg-white dark:bg-[#0c1427] p-6 rounded-lg shadow">
  <h5 className="text-lg font-semibold mb-4">This course includes</h5>

  <ul className="space-y-4">
    <li className="flex justify-between items-center text-gray-700 dark:text-gray-300">
      <div className="flex items-center gap-2">
        <i className="ri-book-2-line text-blue-500 text-xl"></i>
        <span>Lectures</span>
      </div>
      <span className="font-medium">30</span>
    </li>

    <li className="flex justify-between items-center text-gray-700 dark:text-gray-300">
      <div className="flex items-center gap-2">
        <i className="ri-time-line text-blue-500 text-xl"></i>
        <span>Duration</span>
      </div>
      <span className="font-medium">4h 50m</span>
    </li>

    <li className="flex justify-between items-center text-gray-700 dark:text-gray-300">
      <div className="flex items-center gap-2">
        <i className="ri-bar-chart-box-line text-blue-500 text-xl"></i>
        <span>Skills</span>
      </div>
      <span className="font-medium">Beginner</span>
    </li>

    <li className="flex justify-between items-center text-gray-700 dark:text-gray-300">
      <div className="flex items-center gap-2">
        <i className="ri-global-line text-blue-500 text-xl"></i>
        <span>Language</span>
      </div>
      <span className="font-medium">English</span>
    </li>

    <li className="flex justify-between items-center text-gray-700 dark:text-gray-300">
      <div className="flex items-center gap-2">
        <i className="ri-group-line text-blue-500 text-xl"></i>
        <span>Deadline</span>
      </div>
      <span className="font-medium">Nov 30 2021</span>
    </li>

    <li className="flex justify-between items-center text-gray-700 dark:text-gray-300">
      <div className="flex items-center gap-2">
        <i className="ri-medal-line text-blue-500 text-xl"></i>
        <span>Certificate</span>
      </div>
      <span className="font-medium">Yes</span>
    </li>
  </ul>
</div>

                            
              </div>
          </div>
          
        </div>   
    </div>
      {/*end  */}
    <div className="lg:grid lg:grid-cols-12 gap-[25px]" >
        <div className="lg:col-span-7">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                <div className="trezo-card-title">
                  <h5 className="!mb-0">Course Duration & Mode</h5>
                </div>
              </div>
              <div className="trezo-card-content">
                
                <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
                  Course Duration & Mode
                </span>
                <div className="flex items-center gap-2 text-gray-700">
                  <i className="ri-check-line text-green-500"></i>
                    <span><strong>Duration:</strong> ~2 hours (self-paced or classroom supported)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <i className="ri-check-line text-green-500"></i>
                    <span><strong>Format:</strong> Interactive modules, videos, activities, and projects</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <i className="ri-check-line text-green-500"></i>
                    <span><strong>Mode:</strong> Online / Hybrid / Classroom-friendly design</span>
                </div>
                
               
              </div>

              <div className="trezo-card-content">
                
                <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
                  Why Take This Course?
                </span>
                <div className="flex items-center gap-2 text-gray-700">
                  <i className="ri-check-line text-green-500"></i>
                    <span>Gain a <strong>clear, structured foundation</strong> in AI concepts.</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <i className="ri-check-line text-green-500"></i>
                    <span>Learn through <strong>stories, games, and real-world examples.</strong></span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <i className="ri-check-line text-green-500"></i>
                    <span>Build curiosity and readiness for <strong>advanced AI topics.</strong></span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <i className="ri-check-line text-green-500"></i>
                    <span>Be part of the future by understanding how technology works today.</span>
                </div>
                
               
              </div>
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
                      <table className="w-full">
                        <thead className="text-black dark:text-white">
                          <tr>
                            
                            <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[11px] md:ltr:first:pl-[15px] md:rtl:first:pr-[15px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                              Topic Name
                            </th>
                            <th className="font-medium ltr:text-left rtl:text-right px-[10px] py-[11px] md:ltr:first:pl-[15px] md:rtl:first:pr-[15px] ltr:first:pr-0 rtl:first:pl-0 bg-primary-50 dark:bg-[#15203c] whitespace-nowrap">
                              Time Duration
                            </th>
                          </tr>
                        </thead>
          
                        <tbody className="text-black dark:text-white">
                        {course.videos && course.videos.length > 0 ? (
                            course.videos.map((video) => (  
                            <tr key="video._id">
                              <td width="100px"  className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
                                <div className="flex items-center">
                                  <img key="video._id"
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
                              <td  className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
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

    <div className="lg:grid lg:grid-cols-12 gap-[25px]">
        <div className="lg:col-span-10">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                <div className="trezo-card-title">
                  <h5 className="!mb-0">What you&apos;ll learn</h5>
                </div>
              </div>
              <div className="trezo-card-content">
            
                <p><span className="material-symbols-outlined">done</span>
                  Get to know the main functions and common parts of every website.
                </p>
                <p><span className="material-symbols-outlined">done</span>
                  Learn password hashing and de-hashing.
                </p>
                 <p><span className="material-symbols-outlined">done</span>
                  Get to know the main functions and common parts of every website.
                </p>
                <p><span className="material-symbols-outlined">done</span>
                  Learn password hashing and de-hashing.
                </p>

              </div>
               <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <Link
                   key={course._id}
                   href={`/lms/course-details/view-videos/${course._id}`}
                   className="inline-block py-[10px] px-[30px] bg-primary-500 text-white transition-all hover:bg-primary-400 rounded-md border border-primary-500 hover:border-primary-400 ltr:mr-[11px] rtl:ml-[11px] mb-[15px]"
                   target="_blank"
              >
                 Start Course
              </Link>
              </div>
            </div>
        </div>        
    </div>

     
    </>
  );
};
