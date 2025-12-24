import { formatDateTime } from "@/shared/utils/dateTime"

export const getMatchedSubmissionsColumns = () => [
  {
    accessorKey: "studentName",
    header: "Student",
    size: 200,
    cell: ({ row }) => row.original.studentName || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "teamName",
    header: "Team",
    size: 180,
    cell: ({ row }) => row.original.teamName || "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "score",
    header: "Score",
    size: 120,
    cell: ({ row }) => {
      const score = row.original.score
      return score !== undefined && score !== null ? score.toString() : "—"
    },
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted At",
    size: 180,
    cell: ({ row }) => formatDateTime(row.original.submittedAt),
    meta: { className: "truncate max-w-[150px]" },
  },
]

