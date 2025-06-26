import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

function Tabs({ children }) {
  return <TabsPrimitive.Root>{children}</TabsPrimitive.Root>
}

function TabsList({ children }) {
  return (
    <TabsPrimitive.List className="flex gap-2 border-b">
      {children}
    </TabsPrimitive.List>
  )
}

function TabsTrigger({ value, children }) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className="px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:text-black data-[state=active]:border-b-2 border-black"
    >
      {children}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({ value, children }) {
  return (
    <TabsPrimitive.Content value={value} className="py-4">
      {children}
    </TabsPrimitive.Content>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }