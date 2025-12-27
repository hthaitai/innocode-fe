import { ExpandColumn } from "@/shared/components/ExpandColumn"
import { ChevronRight } from "lucide-react"
import { formatDateTime } from "../../../../shared/utils/dateTime"

export const getResultColumns = () => [
  {
    header: "Student",
    accessorKey: "studentName",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ getValue }) => <div className="truncate">{getValue()}</div>,
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
