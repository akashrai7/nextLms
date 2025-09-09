// "use client";

// import React, { useState, ReactNode } from "react";
// import { usePathname } from "next/navigation";
// import SidebarMenu from "@/components/Layout/SidebarMenu";
// import Header from "@/components/Layout/Header";
// import Footer from "@/components/Layout/Footer";

// interface LayoutProviderProps {
//   children: ReactNode;
// }

// const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
//   const pathname = usePathname();

//   const [active, setActive] = useState<boolean>(false);

//   const toggleActive = () => {
//     setActive(!active);
//   };

//   const isAuthPage = [
//     "/authentication/sign-in/",
//     "/authentication/sign-up/",
//     "/authentication/forgot-password/",
//     "/authentication/reset-password/",
//     "/authentication/confirm-email/",
//     "/authentication/lock-screen/",
//     "/authentication/logout/",
//     "/coming-soon/",
//     "/",
//     "/front-pages/features/",
//     "/front-pages/team/",
//     "/front-pages/faq/",
//     "/front-pages/contact/",
//     "/lms/course-details/view-videos/[id]/"
//   ].includes(pathname);

//   return (
//     <>
//       <div
//         className={`main-content-wrap transition-all ${active ? "active" : ""}`}
//       >
//         {!isAuthPage && (
//           <>
//             <SidebarMenu toggleActive={toggleActive} />

//             <Header toggleActive={toggleActive} />
//           </>
//         )}

//         <div className="main-content transition-all flex flex-col overflow-hidden min-h-screen">
//           {children}

//           {!isAuthPage && <Footer />}
//         </div>
//       </div>
//     </>
//   );
// };

// export default LayoutProvider;


"use client";

import React, { useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import SidebarMenu from "@/components/Layout/SidebarMenu";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

interface LayoutProviderProps {
  children: ReactNode;
}

const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const [active, setActive] = useState<boolean>(false);

  const toggleActive = () => {
    setActive(!active);
  };

  // ✅ Prefix based matching
  const noLayoutPrefixes = [
    "/authentication",               // covers all auth pages
    "/coming-soon",                  // covers coming soon page
    "/front-pages",                  // covers all front pages
    "/lms/course-details/view-videos" // covers dynamic video pages
  ];

  const isAuthPage = noLayoutPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  ) || pathname === "/"; // ✅ homepage

  return (
    <div className={`main-content-wrap transition-all ${active ? "active" : ""}`}>
      {!isAuthPage && (
        <>
          <SidebarMenu toggleActive={toggleActive} />
          <Header toggleActive={toggleActive} />
        </>
      )}

      <div className="main-content transition-all flex flex-col overflow-hidden min-h-screen">
        {children}
        {!isAuthPage && <Footer />}
      </div>
    </div>
  );
};

export default LayoutProvider;
