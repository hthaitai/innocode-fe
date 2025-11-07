import React from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"
import { Spinner } from "./SpinnerFluent"

const TableFluent = ({
  data,
  columns,
  loading = false,
  error = null,
  pagination,
  onPageChange,
  onRowClick,
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
                  className={`px-5 py-2 text-[12px] leading-[16px] font-normal text-[#7A7574] border-b border-[#E5E5E5] whitespace-nowrap ${
                    header.column.id === "actions"
                      ? "w-[60px] text-right"
                      : "text-left border-r w-auto align-middle"
                  }`}
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
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-4">
                <Spinner />
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center text-[14px] leading-[20px] text-red-500 py-4"
              >
                {typeof error === "object"
                  ? error.message || JSON.stringify(error)
                  : error}
              </td>
            </tr>
          ) : data.length === 0 ? (
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
            {pagination.totalCount} items
          </div>
          <div className="flex gap-2">
            <button
              disabled={!pagination.hasPreviousPage}
              onClick={() => onPageChange(pagination.pageNumber - 1)}
              className={`${
                !pagination.hasPreviousPage ? "button-gray" : "button-white"
              }`}
            >
              Previous
            </button>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(pagination.pageNumber + 1)}
              className={`${
                !pagination.hasNextPage ? "button-gray" : "button-white"
              }`}
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
