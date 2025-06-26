import React from "react";
import clsx from "clsx";

export function Card({ className = "", ...props }) {
  return (
    <div
      className={clsx("bg-white text-black rounded-lg border shadow-sm p-6", className)}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return (
    <div className={clsx("mb-4", className)} {...props} />
  );
}

export function CardTitle({ className = "", ...props }) {
  return (
    <h3 className={clsx("text-lg font-semibold", className)} {...props} />
  );
}

export function CardDescription({ className = "", ...props }) {
  return (
    <p className={clsx("text-sm text-gray-600", className)} {...props} />
  );
}

export function CardContent({ className = "", ...props }) {
  return (
    <div className={clsx("mb-4", className)} {...props} />
  );
}

export function CardFooter({ className = "", ...props }) {
  return (
    <div className={clsx("mt-4 border-t pt-4 flex justify-end", className)} {...props} />
  );
}