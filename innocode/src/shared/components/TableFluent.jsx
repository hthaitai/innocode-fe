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
        <table className="table-fixed w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <th
                        key={header.id}
                        className="p-2 px-5 text-[12px] leading-[16px] font-normal text-[#7A7574] border-b border-[#E5E5E5] text-left"
                        style={{ width: header.column.getSize() }}
                      >
                        {flexRender(
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

                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        className={`group hover:bg-[#F6F6F6] align-middle transition-colors ${
                          isClickable ? "cursor-pointer" : "cursor-default"
                        }`}
                        onClick={() => isClickable && onRowClick(row.original)}
                      >
                        {visibleCells.map((cell, index) => {
                          return (
                            <td
                              key={cell.id}
                              className={`text-[14px] leading-[20px] border-[#E5E5E5] align-middle p-2 px-5 ${
                                cell.column.columnDef.meta?.className || ""
                              }`}
                              style={{ width: cell.column.getSize() }}
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
                          <td colSpan={visibleCells.length}>
                            {renderSubComponent(row.original)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}

                {/* Empty rows to keep table height consistent */}
                {Array.from({
                  length: pageSize - table.getRowModel().rows.length,
                }).map((_, rowIndex) => (
                  <tr
                    key={`empty-${rowIndex}`}
                    style={{ height: "33px" }} // match your data rows
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={`empty-${rowIndex}-${colIndex}`}
                        className={`text-[14px] leading-[20px] border-[#E5E5E5] align-middle p-2 px-5 ${
                          col.columnDef?.meta?.className || ""
                        }`}
                        style={{ width: col.getSize?.() }}
                      >
                        &#8203;
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
