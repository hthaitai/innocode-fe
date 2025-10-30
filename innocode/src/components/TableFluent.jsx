import React, { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table"
import { ChevronUp, ChevronDown } from "lucide-react"

const TableFluent = ({ data, columns, title, onRowClick }) => {
  const [sorting, setSorting] = useState([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // detect whether rows should be clickable
  const isClickable = typeof onRowClick === "function"

  return (
    <div className="border border-[#E5E5E5] bg-white rounded-[5px] overflow-x-auto relative">
      <table className="table-auto w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`text-[12px] leading-[16px] font-normal text-[#7A7574] border-b border-[#E5E5E5] whitespace-nowrap ${
                    header.column.id === "actions"
                      ? "w-[60px] text-right"
                      : "text-left border-r w-auto align-middle"
                  }`}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={`flex gap-1 items-center px-5 py-2 justify-between select-none ${
                        header.column.getCanSort()
                          ? "cursor-pointer hover:bg-[#F6F6F6]"
                          : ""
                      }`}
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span>
                        {header.column.getIsSorted() === "asc" && (
                          <ChevronUp size={12} />
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <ChevronDown size={12} />
                        )}
                      </span>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={`
                hover:bg-[#F6F6F6] align-middle transition-colors
                ${isClickable ? "cursor-pointer" : "cursor-default"}
              `}
              onClick={() => {
                if (isClickable) onRowClick(row.original)
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`text-[14px] leading-[20px] border-[#E5E5E5] whitespace-nowrap align-middle ${
                    cell.column.id === "actions"
                      ? "w-[60px] p-2 flex justify-center items-center"
                      : "text-left px-5 py-2 border-r"
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableFluent
