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
  renderActions = null,
  getRowId,
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
    getRowId:
      getRowId ||
      ((row, index) =>
        row.submissionId ||
        row.appealId ||
        row.teamId ||
        row.questionId ||
        row.id ||
        `row-${index}`),
  })

  const isClickable = typeof onRowClick === "function"
  const pageSize = data.length

  return (
    <div className="border border-[#E5E5E5] bg-white rounded-[5px] ">
      {renderActions && (
        <div className="border-b border-[#E5E5E5]">{renderActions()}</div>
      )}

      <div
        className="overflow-x-auto relative"
        style={{ maxHeight: `${maxHeight}px`, overflowY: "auto" }}
      >
        <table className="table-fixed w-full border-collapse">
          <thead className="sticky top-0 bg-white z-10 border-b border-[#E5E5E5]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-2 px-5 text-[12px] leading-[16px] font-normal text-[#7A7574]  text-left whitespace-nowrap"
                    style={{ width: header.column.getSize() }}
                  >
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {error ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center text-red-500 py-4 text-[14px] leading-[20px]"
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
                  className="text-center text-[#7A7574] py-4 text-[14px] leading-[20px]"
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
                        {visibleCells.map((cell) => (
                          <td
                            key={cell.id}
                            className={`text-[14px] leading-[20px] border-[#E5E5E5] align-middle p-2 px-5 whitespace-nowrap overflow-hidden text-ellipsis ${
                              cell.column.columnDef.meta?.className || ""
                            }`}
                            style={{ width: cell.column.getSize() }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
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
                  <tr key={`empty-${rowIndex}`} style={{ height: "33px" }}>
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

        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  )
}

export default TableFluentScrollable
