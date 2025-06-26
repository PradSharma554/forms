import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export function DropdownMenu({ children }) {
  return <DropdownMenuPrimitive.Root>{children}</DropdownMenuPrimitive.Root>;
}

export function DropdownMenuTrigger({ children, ...props }) {
  return (
    <DropdownMenuPrimitive.Trigger {...props}>
      {children}
    </DropdownMenuPrimitive.Trigger>
  );
}

export function DropdownMenuContent({ children, className = "", ...props }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={`rounded-md border bg-white shadow-md p-2 min-w-[8rem] ${className}`}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({ children, className = "", ...props }) {
  return (
    <DropdownMenuPrimitive.Item
      className={`px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}