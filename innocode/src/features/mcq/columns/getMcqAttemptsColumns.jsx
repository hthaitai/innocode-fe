import { formatDateTime } from "@/shared/utils/dateTime"

export const getMcqAttemptsColumns = () => [
  {
    accessorKey: "studentName",
    header: "Student name",
    size: 180,
    cell: ({ row }) => row.original.studentName ?? "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "testName",
    header: "Test name",
    size: 200,
    cell: ({ row }) => row.original.testName ?? "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "startTime",
    header: "Start time",
    size: 160,
    cell: ({ row }) => formatDateTime(row.original.startTime),
    meta: { className: "truncate max-w-[160px]" },
  },
  {
    accessorKey: "endTime",
    header: "End time",
    size: 160,
    cell: ({ row }) => formatDateTime(row.original.endTime),
    meta: { className: "truncate max-w-[160px]" },
  },
  {
    accessorKey: "score",
    header: "Score",
    size: 80,
    cell: ({ row }) => {
      const score = row.original.score
      return score != null ? score.toFixed(2) : "—"
    },
    meta: { className: "truncate max-w-[80px]" },
  },
]
