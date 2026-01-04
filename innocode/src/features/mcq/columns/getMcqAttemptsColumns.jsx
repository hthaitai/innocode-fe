import { formatDateTime } from "@/shared/utils/dateTime"

export const getMcqAttemptsColumns = (t) => [
  {
    accessorKey: "studentName",
    header: t("common.studentName"),
    size: 180,
    cell: ({ row }) => row.original.studentName ?? "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "startTime",
    header: t("common.startTime"),
    size: 160,
    cell: ({ row }) => formatDateTime(row.original.startTime),
    meta: { className: "truncate max-w-[160px]" },
  },
  {
    accessorKey: "endTime",
    header: t("common.endTime"),
    size: 160,
    cell: ({ row }) => formatDateTime(row.original.endTime),
    meta: { className: "truncate max-w-[160px]" },
  },
  {
    accessorKey: "score",
    header: t("common.score"),
    size: 80,
    cell: ({ row }) => {
      const score = row.original.score
      const total = row.original.totalPossibleScore
      return score != null
        ? `${score.toFixed(2)} / ${total != null ? total.toFixed(2) : "—"}`
        : "—"
    },
    meta: { className: "truncate max-w-[80px]" },
  },
]
