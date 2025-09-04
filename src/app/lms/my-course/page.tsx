// "use client";

// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// interface Course {
//   _id: string;
//   title: string;
//   slug: string;
//   thumbnail: string;
//   shortDescription: string;
// }

// export default function CoursesPage() {
//   const [courses, setCourses] = useState<Course[]>([]);

//   useEffect(() => {
//     fetch("/api/courses")
//       .then((res) => res.json())
//       .then((data) => setCourses(data));
//   }, []);

//   return (
//     <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {Array.isArray(courses) && courses.map((course) => (
//   <div key={course._id} className="bg-white shadow rounded-xl p-4">
//     <img
//       src={course.thumbnail}
//       alt={course.title}
//       className="rounded-lg w-full h-40 object-cover"
//     />
//     <h2 className="text-lg font-bold mt-3">{course.title}</h2>
//     <p className="text-sm text-gray-500">{course.shortDescription}</p>
//     <Link
//       href={`/courses/${course.slug}`}
//       className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
//     >
//       View Details
//     </Link>
//   </div>
// ))}

//     </div>
//   );
// }

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white dark:bg-[#0c1427] shadow rounded-lg p-4 flex flex-col"
            >
              {/* Thumbnail */}
              {course.thumbnailUrl ? (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="rounded-lg w-full h-40 object-cover mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-gray-500">{course.title}</span>
                </div>
              )}

              {/* Title */}
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <p className="text-sm text-gray-500">{course.category}</p>

              {/* Description */}
              <p className="text-sm mt-2 flex-grow">
                {course.description?.slice(0, 80)}...
              </p>

              {/* Button */}
              <Link
                href={`/lms/my-course/${course._id}`}
                className="mt-3 px-4 py-2 bg-primary-500 text-white rounded-md text-center hover:bg-primary-600 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

