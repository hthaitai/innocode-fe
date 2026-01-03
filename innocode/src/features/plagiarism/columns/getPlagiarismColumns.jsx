import { formatDateTime } from "@/shared/utils/dateTime"

export const getPlagiarismColumns = () => [
  {
    accessorKey: "studentName",
    header: "Student",
    size: 250,
    cell: ({ row }) => row.original.studentName || "—",
    meta: { className: "truncate max-w-[250px]" },
  },
  {
    accessorKey: "teamName",
    header: "Team",
    size: 200,
    cell: ({ row }) => row.original.teamName || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "roundName",
    header: "Round",
    size: 200,
    cell: ({ row }) => row.original.roundName || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "score",
    header: "Score",
    size: 100,
    cell: ({ row }) => {
      const score = row.original.score
      return score !== undefined && score !== null ? score.toString() : "—"
    },
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted at",
    size: 200,
    cell: ({ row }) => formatDateTime(row.original.submittedAt),
    meta: { className: "truncate max-w-[200px]" },
  },
]
