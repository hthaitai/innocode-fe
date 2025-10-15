import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table"
import React, { useState, useRef, useEffect } from "react"
import { Icon } from "@iconify/react"

const Actions = ({ row }) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded hover:bg-[#F2F2F2]"
      >
        <Icon icon="mdi:dots-horizontal" className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-10">
          <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
            Edit
          </button>
          <button className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

const OrganizerContestTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      { accessorKey: "name", header: "Name", size: 200 },
      { accessorKey: "year", header: "Year", size: 50 },
      { accessorKey: "status", header: "Status", size: 50 },
      { accessorKey: "created_at", header: "Created At", size: 200 },
      {
        id: "actions",
        header: "",
        size: 200,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Actions row={row.original} />
          </div>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table className="min-w-full border border-[#E5E5E5] bg-white rounded-[5px]">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="px-5 py-3 text-left border-b border-[#E5E5E5] bg-[]"
                style={{ width: header.getSize() }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="hover:bg-[#F9F9F9]">
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="px-5 py-3 border-b border-gray-200"
                style={{ width: cell.column.getSize() }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default OrganizerContestTable
