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
      {/* start */}
      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-3">
          <div className="trezo-card  dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                <div className="trezo-card-title">
                  <h3 className="!mb-0">The Complete Digital Marketing <br></br>Course - 12 Courses in 1</h3>
                </div>
              </div>
              <div className="trezo-card-content">
                {/* <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
                  Course Description
                </span> */}
                <p className="justify">
                  Satisfied conveying a dependent contented he gentleman agreeable do be.
                   Warrant private blushes removed an in equally totally if.
                    Delivered dejection necessary objection do Mr prevailed. 
                    Mr feeling does chiefly cordial in do.
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

      <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-3">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              
              <div className="trezo-card-content">
                <h4> 
                <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
                  Course Description
                </span>
                </h4>
                <p>
                 Welcome to the Digital Marketing Ultimate Course Bundle
                  - 12 Courses in 1 (Over 36 hours of content)
                </p>
                <p>In this practical hands-on training, you’re going to learn to become a digital marketing expert with this ultimate course bundle that includes 12 digital marketing courses in 1!</p>
                <p>If you wish to find out the skills that should be covered in a basic digital marketing course syllabus in India or anywhere around the world, then reading this blog will help. Before we delve into the advanced digital marketing course syllabus,
                   let’s look at the scope of digital marketing and what the future holds.</p>
                <p>We focus a great deal on the understanding of behavioral psychology and influence triggers
                   which are crucial for becoming a well rounded Digital Marketer. We understand that theory is important to build a solid foundation, we understand that theory alone isn’t going to get the job done so that’s why this course is
                   packed with practical hands-on examples that you can follow step by step.</p>
                
                  <h4>
                <span className="text-black dark:text-white font-medium block mb-[7px] mt-[22px]">
                  What you’ll learn
                </span>
                </h4>
                <div className="space-y-3">
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Digital marketing course introduction</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Customer Life cycle</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>What is Search engine optimization(SEO)</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Facebook ADS</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Facebook Messenger Chatbot</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Search engine optimization tools</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Why SEO</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>URL Structure</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Featured Snippet</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>SEO tips and tricks</span>
  </div>
  <div className="flex items-center gap-2 text-gray-700">
    <i className="ri-check-line text-green-500"></i>
    <span>Google tag manager</span>
  </div>
</div>

                <p className="mt-6 text-gray-500 leading-relaxed">
                  As it so contrasted oh estimating instrument. Size like body someone had. Are conduct viewing boy minutes warrant the expense? 
                  Tolerably behavior may admit daughters offending her ask own. Praise effect wishes change way and any wanted. 
                  Lively use looked latter regard had. Do he it part more last in.
                </p>
                
              </div>
          
          </div>
        </div>   
        <div className="lg:col-span-2">
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
                                  10th
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
  <h3 className="text-lg font-semibold mb-4">This course includes</h3>

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
                  <img  key="video._id"
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
                            <tr key="video._id">
                              <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] md:ltr:first:pl-[25px] md:rtl:first:pr-[25px] ltr:first:pr-0 rtl:first:pl-0 border-b border-gray-100 dark:border-[#172036]">
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

    <div className="lg:grid lg:grid-cols-5 gap-[25px]">
        <div className="lg:col-span-5">
          <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
              <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
                <div className="trezo-card-title">
                  <h5 className="!mb-0">What you'll learn</h5>
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
