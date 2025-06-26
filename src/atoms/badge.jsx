import React from "react";
import clsx from "clsx";

const badgeVariants = {
  default: "bg-purple-600 text-white",
  secondary: "bg-gray-200 text-black",
  destructive: "bg-red-600 text-white",
  outline: "border border-gray-400 text-gray-700",
};

export function Badge({ className = "", variant = "default", children, ...props }) {
  const combined = clsx(
    "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md",
    badgeVariants[variant],
    className
  );

  return (
    <span className={combined} {...props}>
      {children}
    </span>
  );
}