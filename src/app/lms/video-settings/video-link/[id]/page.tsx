"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "@/components/LMS/video/Nav";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Chapter {
  _id: string;
  name: string;
}

interface Video {
  _id: string;
  chapter: Chapter;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
}

export default function VideosTable() {

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // empty string hata do
  const courseId = segments[segments.length - 1]; // last part hamesha ID hoga

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`/api/addVideo?courseId=${courseId}`);
      if (res.data.ok) {
        setVideos(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch videos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [courseId]);

  if (loading) {
    return <p className="text-gray-500">Loading videos...</p>;
  }

  if (!videos.length) {
    return <p className="text-red-500">No videos found for this course.</p>;
  }


  return (
    <>
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">View Videos</h5>

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
          
           <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b text-left">#</th>
            <th className="px-4 py-2 border-b text-left">Chapter</th>
            <th className="px-4 py-2 border-b text-left">Title</th>
            <th className="px-4 py-2 border-b text-left">Description</th>
            <th className="px-4 py-2 border-b text-left">Thumbnail</th>
            <th className="px-4 py-2 border-b text-left">Video</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video, idx) => (
            <tr key={video._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{idx + 1}</td>
              <td className="px-4 py-2 border-b">{video.chapter?.name || "-"}</td>
              <td className="px-4 py-2 border-b">{video.title}</td>
              <td className="px-4 py-2 border-b">{video.description}</td>
              <td className="px-4 py-2 border-b">
                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt="Thumbnail"
                    className="h-12 w-20 object-cover rounded"
                  />
                )}
              </td>
              <td className="px-4 py-2 border-b">
                {video.videoUrl ? (
                  <video
                    src={video.videoUrl}
                    controls
                    className="h-20 w-32 rounded"
                  />
                ) : (
                  <span className="text-gray-400">No video</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      </div>
    </>
  );
}
