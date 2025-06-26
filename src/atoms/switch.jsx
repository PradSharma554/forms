import React from "react";
import clsx from "clsx";

export function Switch({ className = "", checked, onCheckedChange, ...props }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />
      <div
        className={clsx(
          "w-6 h-6 bg-gray-300 rounded-full peer-checked:bg-red-600 relative transition",
          className
        )}
      >
      </div>
    </label>
  );
}