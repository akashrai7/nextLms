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
            <h5 className="!mb-0">Profile Information</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <ul>
            <li className="mb-[12.5px] last:mb-0">
              User ID:
              <span className="text-black dark:text-white font-medium">
                {user.registrationId}
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Full Name:
              <span className="text-black dark:text-white font-medium">
                {user.firstName} {user.lastName}
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              DOB:
              <span className="text-black dark:text-white font-medium">
                {user.dob}
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Role:
              <span className="text-black dark:text-white font-medium">
                {user.role}
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Location:
              <span className="text-black dark:text-white font-medium">
                {user.district}
              </span>
            </li>
           
          </ul>
        </div>
      </div>
    </>
  );
};

