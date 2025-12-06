import { ChevronRight } from "lucide-react"
import StatusBadge from "../../../../shared/components/StatusBadge"
import { formatDateTime } from "../../../../shared/utils/dateTime"

const getAutoResultColumns = () => [
  {
    header: "Student",
    accessorKey: "submittedByStudentName",
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
    accessorKey: "teamName",
    header: "Team name",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row }) => row.original.teamName || "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    meta: { className: "truncate max-w-[120px]" },
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "score",
    header: "Score",
    size: 80,
    meta: { className: "" },
  },
  {
    accessorKey: "submissionAttemptNumber",
    header: "Attempts",
    size: 80,
    meta: { className: "" },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
]

export default getAutoResultColumns
