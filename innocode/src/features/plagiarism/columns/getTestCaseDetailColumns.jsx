import { formatDateTime } from "@/shared/utils/dateTime"

export const getTestCaseDetailColumns = () => [
  {
    accessorKey: "weight",
    header: "Weight",
    size: 100,
    cell: ({ row }) => row.original.weight || "—",
  },
  {
    accessorKey: "note",
    header: "Note",
    size: 200,
    cell: ({ row }) => row.original.note || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "runtimeMs",
    header: "Runtime",
    size: 120,
    cell: ({ row }) => {
      const runtime = row.original.runtimeMs
      return runtime !== undefined && runtime !== null ? `${runtime} ms` : "—"
    },
  },
  {
    accessorKey: "memoryKb",
    header: "Memory",
    size: 120,
    cell: ({ row }) => {
      const memory = row.original.memoryKb
      return memory !== undefined && memory !== null ? `${memory} KB` : "—"
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    size: 180,
    cell: ({ row }) => formatDateTime(row.original.createdAt),
    meta: { className: "truncate max-w-[150px]" },
  },
]

