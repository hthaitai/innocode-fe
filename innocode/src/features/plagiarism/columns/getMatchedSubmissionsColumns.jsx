import { formatDateTime } from "@/shared/utils/dateTime"

export const getMatchedSubmissionsColumns = (t) => [
  {
    accessorKey: "studentName",
    header: t("plagiarism:student"),
    size: 200,
    cell: ({ row }) => row.original.studentName || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "teamName",
    header: t("plagiarism:team"),
    size: 180,
    cell: ({ row }) => row.original.teamName || "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "score",
    header: t("plagiarism:score"),
    size: 120,
    cell: ({ row }) => {
      const score = row.original.score
      return score !== undefined && score !== null ? score.toString() : "—"
    },
  },
  {
    accessorKey: "submittedAt",
    header: t("plagiarism:submittedAt"),
    size: 180,
    cell: ({ row }) => formatDateTime(row.original.submittedAt),
    meta: { className: "truncate max-w-[150px]" },
  },
]
