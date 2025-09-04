"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios"; // ✅ Import added

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (res.data.ok) {
          setUser(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <p>Unauthorized. Please <a href="/authentication/login">login</a></p>;
  }

  return (
    <>
      <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="trezo-card-header mb-[20px] md:mb-[25px] flex items-center justify-between">
          <div className="trezo-card-title">
            <h5 className="!mb-0">Profile Intro</h5>
          </div>
        </div>

        <div className="trezo-card-content">
          <div className="flex items-center">
            <Image
              src="/images/admin.png"
              alt="user-image"
              className="rounded-full w-[75px]"
              width={75}
              height={75}
            />
            <div className="ltr:ml-[15px] rtl:mr-[15px]">
              <span className="block text-black dark:text-white text-[17px] font-semibold">
                {user.firstName} {user.lastName}
              </span>
              <span className="block mt-px">{user.role}</span>
            </div>
          </div>

          <span className="text-black dark:text-white font-semibold block mb-[5px] mt-[16px]">
            About Me
          </span>

          <p>
            {user.message}
          </p>

          
        </div>
      </div>
    </>
  );
};

