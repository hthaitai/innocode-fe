import { ExpandColumn } from "@/shared/components/ExpandColumn"
import { ChevronRight } from "lucide-react"
import { formatDateTime } from "../../../../shared/utils/dateTime"

export const getResultColumns = () => [
  {
    header: "Student",
    accessorKey: "studentName",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row, getValue }) => {
      const isExpanded = row.getIsExpanded()
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              row.toggleExpanded()
            }}
            className={`p-0 flex items-center justify-center rounded select-none text-[#7A7574] hover:text-black ${
              isExpanded ? "rotate-90" : "rotate-0"
            }`}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            style={{ transition: "none" }}
          >
            <ChevronRight size={16} className="leading-none" />
          </button>
          <span className="truncate">{getValue()}</span>
        </div>
      )
    },
  },
  {
    header: "Team",
    accessorKey: "teamName",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    header: "Submitted at",
    accessorKey: "submittedAt",
    size: 160,
    cell: ({ getValue }) => formatDateTime(getValue()),
    meta: { className: "truncate max-w-[160px]" },
  },
  {
    header: "Judged by",
    accessorKey: "judgedBy",
    size: 160,
    meta: { className: "truncate max-w-[160px]" },
  },
  {
    header: "Score",
    accessorKey: "totalScore",
    size: 80,
    cell: ({ row }) =>
      `${row.original.totalScore} / ${row.original.maxPossibleScore}`,
    meta: { className: "truncate max-w-[80px]" },
  },
]
