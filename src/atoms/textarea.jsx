import React from "react";
import clsx from "clsx";

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={clsx(
        "w-full min-h-[4rem] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500",
        className
      )}
      {...props}
    />
  );
}