"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-[#0a0e19] text-center px-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
        You don’t have permission to access this page.
      </p>

      <Link
        href="/"
        className="px-6 py-3 rounded-md bg-primary-500 hover:bg-primary-400 text-white font-medium transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
}
