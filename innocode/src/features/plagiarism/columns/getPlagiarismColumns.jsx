import { formatDateTime } from "@/shared/utils/dateTime"

export const getPlagiarismColumns = () => [
  {
    accessorKey: "studentName",
    header: "Student",
    size: 180,
    cell: ({ row }) => row.original.studentName || "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "teamName",
    header: "Team",
    size: 180,
    cell: ({ row }) => row.original.teamName || "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "contestName",
    header: "Contest",
    size: 180,
    cell: ({ row }) => row.original.contestName || "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "roundName",
    header: "Round",
    size: 150,
    cell: ({ row }) => row.original.roundName || "—",
    meta: { className: "truncate max-w-[150px]" },
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
    header: "Submitted at",
    size: 180,
    cell: ({ row }) => formatDateTime(row.original.submittedAt),
    meta: { className: "truncate max-w-[150px]" },
  },
]

