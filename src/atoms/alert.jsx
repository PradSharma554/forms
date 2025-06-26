import React from "react";
import clsx from "clsx";

const alertVariants = {
  default: "bg-gray-100 text-black border border-gray-300",
  destructive: "bg-red-100 text-red-700 border border-red-400",
};

export function Alert({ className = "", variant = "default", children, ...props }) {
  const combined = clsx(
    "rounded-md p-4 text-sm",
    alertVariants[variant],
    className
  );

  return (
    <div role="alert" className={combined} {...props}>
      {children}
    </div>
  );
}

export function AlertTitle({ className = "", children, ...props }) {
  return (
    <div className={clsx("font-semibold mb-1", className)} {...props}>
      {children}
    </div>
  );
}

export function AlertDescription({ className = "", children, ...props }) {
  return (
    <div className={clsx("text-sm text-gray-700", className)} {...props}>
      {children}
    </div>
  );
}
