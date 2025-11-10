import { formatDateTime } from "@/shared/utils/dateTime"

export const getMcqAttemptsColumns = () => [
  {
    accessorKey: "studentName",
    header: "Student Name",
    cell: ({ row }) => row.original.studentName ?? "—",
  },
  {
    accessorKey: "testName",
    header: "Test Name",
    cell: ({ row }) => row.original.testName ?? "—",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => formatDateTime(row.original.startTime),
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => formatDateTime(row.original.endTime),
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      const score = row.original.score
      return score != null ? score.toFixed(2) : "—"
    },
  },
]
