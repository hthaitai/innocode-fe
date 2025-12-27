import { formatDateTime } from "@/shared/utils/dateTime"

export const getAppealsColumns = () => [
  {
    accessorKey: "ownerName",
    header: "Student",
    size: 180,
    cell: ({ row }) => row.original.ownerName || "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "roundName",
    header: "Round",
    size: 240,
    cell: ({ row }) => row.original.roundName || "—",
    meta: { className: "truncate max-w-[150px]" },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    size: 320,
    cell: ({ row }) => row.original.reason || "—",
    meta: { className: "truncate max-w-[380px]" },
  },
  {
    accessorKey: "createdAt",
    header: "Submitted",
    size: 250,
    cell: ({ row }) => formatDateTime(row.original.createdAt),
    meta: { className: "truncate max-w-[250px]" },
  },
]
