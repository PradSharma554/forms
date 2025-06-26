import React from "react";
import clsx from "clsx";

export function Input({ className = "", type = "text", ...props }) {
  return (
    <input
      type={type}
      className={clsx(
        "w-full h-9 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500",
        className
      )}
      {...props}
    />
  );
}