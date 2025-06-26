import React from "react"

function Table({ children }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  )
}

function TableHeader({ children }) {
  return <thead className="bg-gray-100">{children}</thead>
}

function TableBody({ children }) {
  return <tbody>{children}</tbody>
}

function TableRow({ children }) {
  return <tr className="border-b hover:bg-gray-50">{children}</tr>
}

function TableHead({ children }) {
  return <th className="text-left p-3 font-medium">{children}</th>
}

function TableCell({ children }) {
  return <td className="p-3">{children}</td>
}

function TableCaption({ children }) {
  return <caption className="text-sm text-gray-500 mt-4">{children}</caption>
}

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}