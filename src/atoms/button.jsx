import React from "react";
import clsx from "clsx";

export function Button({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-purple-600 text-white hover:bg-purple-700",
    outline: "border border-gray-300 text-black hover:bg-gray-100",
    ghost: "bg-transparent text-purple-600 hover:bg-purple-100",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-3",
  };

  const combined = clsx(base, variants[variant], sizes[size], className);

  return (
    <button className={combined} {...props}>
      {children}
    </button>
  );
}