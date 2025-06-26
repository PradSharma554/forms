import React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

export function RadioGroup({ children, ...props }) {
  return (
    <RadioGroupPrimitive.Root {...props} className="flex gap-3">
      {children}
    </RadioGroupPrimitive.Root>
  );
}

export function RadioGroupItem({ value, ...props }) {
  return (
    <RadioGroupPrimitive.Item
      value={value}
      className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500"
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="w-2 h-2 bg-white rounded-full" />
    </RadioGroupPrimitive.Item>
  );
}