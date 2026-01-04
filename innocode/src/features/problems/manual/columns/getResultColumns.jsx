import { ExpandColumn } from "@/shared/components/ExpandColumn"
import { ChevronRight } from "lucide-react"
import { formatDateTime } from "../../../../shared/utils/dateTime"

export const getResultColumns = (t) => [
  {
    header: t("common.student"),
    accessorKey: "studentName",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ getValue }) => <div className="truncate">{getValue()}</div>,
  },
  {
    header: t("common.team"),
    accessorKey: "teamName",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    header: t("common.submittedAt"),
    accessorKey: "submittedAt",
    size: 160,
    cell: ({ getValue }) => formatDateTime(getValue()),
    meta: { className: "truncate max-w-[160px]" },
  },
  {
    header: t("common.judgedBy"),
    accessorKey: "judgedBy",
    size: 160,
    meta: { className: "truncate max-w-[160px]" },
  },
  {
    header: t("common.score"),
    accessorKey: "totalScore",
    size: 80,
    cell: ({ row }) =>
      `${row.original.totalScore} / ${row.original.maxPossibleScore}`,
    meta: { className: "truncate max-w-[80px]" },
  },
]
