
// "use client";

// import React, { useEffect, useState } from "react";
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

//   useEffect(() => {
//     fetchCourse();
//   }, [id]);

//   if (loading) return <p className="text-center py-10">Loading course...</p>;
//   if (!course) return <p className="text-center py-10">Course not found..</p>;

//   return (
//     <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
//       {/* Left Playlist */}
//       <div className="lg:col-span-1 bg-white dark:bg-[#0c1427] shadow rounded-lg p-4">
//         <h2 className="text-lg font-semibold mb-4">Playlist</h2>
//         <ul className="space-y-2">
//   {course.videos && course.videos.length > 0 ? (
//     course.videos.map((video) => (
//       <li key={video._id}>
//         <button
//           onClick={() => setCurrentVideo(video)}
//           className={`w-full text-left px-3 py-2 rounded-md ${
//             currentVideo?._id === video._id
//               ? "bg-primary-500 text-white"
//               : "bg-gray-100 dark:bg-gray-800"
//           }`}
//         >
//           {video.title}
//         </button>
//       </li>
//     ))
//   ) : (
//     <li className="text-gray-500">No videos in playlist.</li>
//   )}
// </ul>

//       </div>

//       {/* Right Video Player */} 
//       <div className="lg:col-span-3 bg-white dark:bg-[#0c1427] shadow rounded-lg p-4">
//         {currentVideo ? (
//           <>
//             <h1 className="text-xl font-bold mb-3">{course.title}</h1>
//             <p className="text-sm text-gray-500 mb-4">{course.description}</p>

//             <video
//               key={currentVideo._id}
//               src={currentVideo.playbackUrl}
//               poster={currentVideo.posterUrl}
//               controls
//               preload="metadata"
//               playsInline
//               className="w-full h-[400px] rounded-lg bg-black"
//             />

//             <h2 className="mt-4 text-lg font-semibold">
//               Now Playing: {currentVideo.title}
//             </h2>
//             <p className="text-sm text-gray-500">
//               Duration: {Math.floor(currentVideo.durationSec / 60)}m{" "}
//               {currentVideo.durationSec % 60}s
//             </p>
//           </>
//         ) : (
//           <p>No videos available for this course.</p>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "axios";

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

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  // Fetch course + videos
  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/api/courses/${id}`);
      console.log("📡 API Response:", res.data); // ✅ Debug log

      if (res.data.success && res.data.data) {
        const courseData: Course = res.data.data;
        setCourse(courseData);

        if (courseData.videos && courseData.videos.length > 0) {
          setCurrentVideo(courseData.videos[0]); // auto play first video
        }
      }
    } catch (error) {
      console.error("❌ Failed to fetch course details", error);
    } finally {
      setLoading(false);
    }
  };
  
useEffect(() => {
    fetchCourse();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading course...</p>;
  if (!course) return <p className="text-center py-10">Course not found..</p>;
  


  return (
     <>   {/* bg-white */}
     
      <div className="auth-main-content text-white bg-black dark:bg-[#0a0e19] px-[10px] py-[10px] md:py-[10px] lg:px-[40px] lg:py-[40px]"> 
       <div className="lg:grid lg:grid-cols-12 gap-[25px]">
        <div className="lg:col-span-8">
            {currentVideo ? (
           <>
             <p className="text-xl text-white font-bold mb-5">{course.title} ({course.description})</p>
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

            <p className="mt-4 text-lg text-white-500 font-semibold">
              Now Playing: {currentVideo.title}
            </p>
            <p className="text-sm text-white-500">
              Duration: {Math.floor(currentVideo.durationSec / 60)}m{" "}
              {currentVideo.durationSec % 60}s
            </p>
           </>
          ) : (
             <p>No videos available for this course.</p>
          )}
        </div>
        <div className="lg:col-span-3">
            {/* Left Playlist */}
              <div className="lg:col-span-1 bg-white dark:bg-[#0c1427] shadow  p-4">
                <h4 className="text-lg font-semibold mb-4">Course content</h4>
                  <ul className="space-y-2">
                    {course.videos && course.videos.length > 0 ? (
                       course.videos.map((video) => (
                        <li key={video._id}>
                          <button
                            onClick={() => setCurrentVideo(video)}
                            className={`w-full text-left px-3 py-2 rounded-md ${
                            currentVideo?._id === video._id
                            ? "bg-primary-500 text-white"
                            : "bg-gray-100 dark:bg-gray-800"
                          }`}
                          >
                          {video.title}
                          </button>
                        </li>
                         ))
                        )   : (
                        <li className="text-gray-500">No videos in playlist.</li>
                        )}
                  </ul>

              </div>
        </div>
      </div>


      </div>
    </>
  );
};


