import React, { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Spinner } from "./SpinnerFluent"

const TableFluent = ({
  data = [], // ✅ Add default value to prevent undefined
  columns,
  title,
  pagination,
  onRowClick,
  onPageChange,
  loading = false,
  error = null,
}) => {
  const [sorting, setSorting] = useState([])

  const table = useReactTable({
    data: data || [], // ✅ Ensure data is always an array
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const isClickable = typeof onRowClick === "function"

  return (
    <div className="border border-[#E5E5E5] bg-white rounded-[5px] overflow-x-auto relative">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <Spinner />
        </div>
      )}

      {/* Error overlay */}
      {error && !loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      )}

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
          {!data || data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center text-[14px] leading-[20px] text-[#7A7574] py-4"
              >
                No data available
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-[#F6F6F6] align-middle transition-colors ${
                  isClickable ? "cursor-pointer" : "cursor-default"
                }`}
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
            ))
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="flex justify-between items-center px-5 py-3 border-t border-[#E5E5E5] ">
          <div className="text-sm leading-5 text-[#7A7574]">
            Page {pagination.pageNumber} of {pagination.totalPages} —{" "}
            {pagination.totalCount} total contests
          </div>
          <div className="flex gap-2">
            <button
              disabled={!pagination.hasPreviousPage}
              onClick={() => onPageChange(pagination.pageNumber - 1)}
              className="button-white disabled:button-gray"
            >
              Previous
            </button>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(pagination.pageNumber + 1)}
              className="button-white disabled:button-gray"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TableFluent
