import React from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getExpandedRowModel,
} from "@tanstack/react-table"
import { Spinner } from "../SpinnerFluent"

const TableFluentScrollable = ({
  data = [],
  columns,
  loading = false,
  error = null,
  onRowClick,
  renderSubComponent,
  expandAt = null,
  maxHeight = 400, // default scrollable height
}) => {
  const [expanded, setExpanded] = React.useState({})

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    state: { expanded },
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    getRowId: (row) => row.questionId,
  })

  const isClickable = typeof onRowClick === "function"

  return (
    <div
      className="border border-[#E5E5E5] bg-white rounded overflow-x-auto relative"
      style={{ maxHeight: `${maxHeight}px`, overflowY: "auto" }}
    >
      <table className="table-auto w-full border-collapse">
        <thead className="sticky top-0 bg-white z-10">
          {table.getHeaderGroups().map((headerGroup) => {
            const actionIndex = headerGroup.headers.findIndex(
              (h) => h.column.id === "actions"
            )
            const expandIndex =
              actionIndex === -1
                ? headerGroup.headers.length - 1
                : actionIndex - 1

            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const isExpandingColumn = index === expandIndex
                  return (
                    <th
                      key={header.id}
                      className={`px-5 py-2 text-[12px] leading-[16px] font-normal text-[#7A7574] border-b border-[#E5E5E5] whitespace-nowrap ${
                        header.column.id === "actions"
                          ? "w-[60px] text-right"
                          : "text-left border-r w-auto align-middle"
                      }`}
                      style={isExpandingColumn ? { width: "100%" } : {}}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  )
                })}
              </tr>
            )
          })}
        </thead>

        <tbody>
          {error ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center text-red-500 py-4 text-sm"
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
                className="text-center text-gray-500 py-4 text-sm"
              >
                No data available.
              </td>
            </tr>
          ) : (
            <>
              {table.getRowModel().rows.map((row) => {
                const visibleCells = row.getVisibleCells()
                const actionIndex = visibleCells.findIndex(
                  (c) => c.column.id === "actions"
                )
                const expandIndex =
                  actionIndex === -1
                    ? visibleCells.length - 1
                    : actionIndex - 1

                return (
                  <React.Fragment key={row.id}>
                    <tr
                      className={`group hover:bg-[#F6F6F6] transition-colors ${
                        isClickable ? "cursor-pointer" : "cursor-default"
                      }`}
                      onClick={() => isClickable && onRowClick(row.original)}
                    >
                      {visibleCells.map((cell, index) => {
                        const isExpandingColumn = index === expandIndex
                        return (
                          <td
                            key={cell.id}
                            className={`text-sm leading-5 border-[#E5E5E5] whitespace-nowrap align-middle ${
                              cell.column.id === "actions"
                                ? "w-[60px] p-2 flex justify-center items-center"
                                : "px-5 py-2 border-r"
                            }`}
                            style={isExpandingColumn ? { width: "100%" } : {}}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        )
                      })}
                    </tr>

                    {row.getIsExpanded() && renderSubComponent && (
                      <tr>
                        {visibleCells.map((cell, index) => {
                          const isExpandingColumn = index === expandIndex
                          const isCorrectExpandColumn = expandAt
                            ? cell.column.id === expandAt
                            : index === expandIndex

                          const isLast = index === visibleCells.length - 1

                          return (
                            <td
                              key={index}
                              className={`px-5 align-top ${
                                !isLast ? "border-r border-[#E5E5E5]" : ""
                              }`}
                              style={isExpandingColumn ? { width: "100%" } : {}}
                            >
                              {isCorrectExpandColumn
                                ? renderSubComponent(row.original)
                                : null}
                            </td>
                          )
                        })}
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </>
          )}
        </tbody>
      </table>

      {/* Overlay spinner */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default TableFluentScrollable
