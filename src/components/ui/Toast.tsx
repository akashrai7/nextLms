"use client";
import React from "react";

export default function Toast({
  type = "success",
  message,
  onClose,
}: { type?: "success" | "error"; message: string; onClose: () => void }) {
  return (
    <div className={`fixed bottom-5 right-5 z-[100] rounded-md px-4 py-3 shadow-lg
      ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
      <div className="flex items-center gap-3">
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="underline">Close</button>
      </div>
    </div>
  );
}
