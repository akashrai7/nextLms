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
            <h5 className="!mb-0">Additional Information</h5>
          </div>
        </div>
        <div className="trezo-card-content">
          <ul>
            <li className="mb-[12.5px] last:mb-0">
              Phone:
              <span className="text-black dark:text-white font-medium">
                {user.mobile}
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Email:
              <span className="text-black dark:text-white font-medium">
                {user.email}
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Address:
              <span className="text-black dark:text-white font-medium">
                {user.Address} {user.District}
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              State:
              <span className="text-black dark:text-white font-medium">
                {user.state}
              </span>
            </li>
            <li className="mb-[12.5px] last:mb-0">
              Products:
              <span className="text-black dark:text-white font-medium">
                {user.pincod}
              </span>
            </li>
            
          </ul>
        </div>
      </div>
    </>
  );
};

