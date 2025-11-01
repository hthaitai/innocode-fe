import React from "react"
import { StatusBadge } from "@/shared/utils/StatusBadge"

const DetailTableSection = ({ rows = [] }) => {
  return (
    <div className="border border-[#E5E5E5] rounded-[5px] divide-y divide-[#E5E5E5] bg-white text-sm leading-5">
      {rows.map((row) => (
        <div
          key={row.label}
          className={`flex flex-col sm:flex-row justify-between pl-[60px] pr-5 ${
            row.align === "top" ? "sm:items-start" : "sm:items-center"
          }`}
        >
          {/* Label */}
          <div className="py-4 w-[99px] pr-7 font-normal text-left whitespace-nowrap">
            {row.label}
          </div>

          {/* Value */}
          <div className="py-4 flex-1 min-w-0 text-[#7A7574] pr-4 break-words whitespace-normal">
            {row.label.toLowerCase() === "state" ? (
              <StatusBadge status={row.value} />
            ) : (
              row.value || "—"
            )}
          </div>

          {/* Action */}
          {row.onAction && (
            <div className="py-[10px] text-right whitespace-nowrap">
              <button className="button-orange" onClick={row.onAction}>
                Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default DetailTableSection
