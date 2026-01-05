import { formatDateTime } from "@/shared/utils/dateTime"

export const getPlagiarismColumns = (t) => [
  {
    accessorKey: "studentName",
    header: t("plagiarism:student"),
    size: 250,
    cell: ({ row }) => row.original.studentName || "—",
    meta: { className: "truncate max-w-[250px]" },
  },
  {
    accessorKey: "teamName",
    header: t("plagiarism:team"),
    size: 200,
    cell: ({ row }) => row.original.teamName || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "roundName",
    header: t("plagiarism:round"),
    size: 200,
    cell: ({ row }) => row.original.roundName || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "score",
    header: t("plagiarism:score"),
    size: 100,
    cell: ({ row }) => {
      const score = row.original.score
      return score !== undefined && score !== null ? score.toString() : "—"
    },
  },
  {
    accessorKey: "submittedAt",
    header: t("plagiarism:submittedAt"),
    size: 200,
    cell: ({ row }) => formatDateTime(row.original.submittedAt),
    meta: { className: "truncate max-w-[200px]" },
  },
]
