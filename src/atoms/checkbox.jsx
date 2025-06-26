import React from "react";
import clsx from "clsx";

export function Checkbox({ className = "", ...props }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input type="checkbox" className={clsx("w-4 h-4 rounded border border-gray-300 text-purple-600 focus:ring focus:ring-purple-200", className )} {...props} />
    </label>
  );
}