import { formatDateTime } from "@/shared/utils/dateTime"

export const getTestCaseDetailColumns = (t) => [
  {
    accessorKey: "weight",
    header: t("plagiarism:weight"),
    size: 100,
    cell: ({ row }) => row.original.weight || "—",
  },
  {
    accessorKey: "note",
    header: t("plagiarism:note"),
    size: 200,
    cell: ({ row }) => row.original.note || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "runtimeMs",
    header: t("plagiarism:runtime"),
    size: 120,
    cell: ({ row }) => {
      const runtime = row.original.runtimeMs
      return runtime !== undefined && runtime !== null ? `${runtime} ms` : "—"
    },
  },
  {
    accessorKey: "memoryKb",
    header: t("plagiarism:memory"),
    size: 120,
    cell: ({ row }) => {
      const memory = row.original.memoryKb
      return memory !== undefined && memory !== null ? `${memory} KB` : "—"
    },
  },
  {
    accessorKey: "createdAt",
    header: t("plagiarism:createdAt"),
    size: 180,
    cell: ({ row }) => formatDateTime(row.original.createdAt),
    meta: { className: "truncate max-w-[150px]" },
  },
]
