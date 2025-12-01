import { ExpandColumn } from "@/shared/components/ExpandColumn"

export const getResultColumns = () => [
  ExpandColumn,
  {
    header: "Student",
    accessorKey: "studentName",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    header: "Team",
    accessorKey: "teamName",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    header: "Submitted At",
    accessorKey: "submittedAt",
    size: 160,
    cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
    meta: { className: "truncate max-w-[160px]" },
  },
  {
    header: "Judged By",
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
