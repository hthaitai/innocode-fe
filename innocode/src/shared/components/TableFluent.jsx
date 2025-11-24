import React from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getExpandedRowModel,
} from "@tanstack/react-table"
import { Spinner } from "./SpinnerFluent"
import TablePagination from "./TablePagination"

const TableFluent = ({
  data = [], // ✅ Add default value to prevent undefined
  columns,
  loading = false,
  error = null,
  pagination,
  onPageChange,
  onRowClick,
  renderSubComponent,
  expandAt = null,
}) => {
  const [expanded, setExpanded] = React.useState({})

  const table = useReactTable({
    data: data || [], // ✅ Ensure data is always an array
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    state: { expanded },
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    getRowId: (row) => row.questionId,
  })

  const isClickable = typeof onRowClick === "function"
  const pageSize = pagination?.pageSize || data.length

  return (
    <div>
      <div className="relative border border-[#E5E5E5] bg-white rounded-[5px] overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
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
                        className={`hover:bg-[#F6F6F6] align-middle transition-colors ${
                          isClickable ? "cursor-pointer" : "cursor-default"
                        }`}
                        onClick={() => isClickable && onRowClick(row.original)}
                      >
                        {visibleCells.map((cell, index) => {
                          const isExpandingColumn = index === expandIndex
                          return (
                            <td
                              key={cell.id}
                              className={`text-[14px] leading-[20px] border-[#E5E5E5] whitespace-nowrap align-middle ${
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
                              : index === expandIndex // match parent logic

                            const isLast = index === visibleCells.length - 1

                            return (
                              <td
                                key={index}
                                className={`px-5 align-top ${
                                  !isLast ? "border-r border-[#E5E5E5]" : ""
                                } ${
                                  isCorrectExpandColumn
                                    ? ""
                                    : ""
                                }`}
                                style={
                                  isExpandingColumn ? { width: "100%" } : {}
                                } // <-- same logic added here
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

                {/* Empty rows to keep table height consistent */}
                {Array.from({
                  length: pageSize - table.getRowModel().rows.length,
                }).map((_, rowIndex) => (
                  <tr key={`empty-${rowIndex}`}>
                    {columns.map((col, colIndex) => (
                      <td
                        key={`empty-${rowIndex}-${colIndex}`} // unique key per row & column
                        className={`text-[14px] leading-[20px] border-[#E5E5E5] whitespace-nowrap align-middle ${
                          col.id === "actions"
                            ? "w-[60px] p-2"
                            : "text-left px-5 py-2 border-r"
                        }`}
                      >
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
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

      <div>
        <TablePagination pagination={pagination} onPageChange={onPageChange} />
      </div>
    </div>
  )
}

export default TableFluent
