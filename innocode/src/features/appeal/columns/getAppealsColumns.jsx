import { formatDateTime } from "@/shared/utils/dateTime"

export const getAppealsColumns = (handleReview) => [
  {
    accessorKey: "ownerName",
    header: "Student",
    size: 150,
    cell: ({ row }) => row.original.ownerName || "—",
    meta: { className: "truncate max-w-[150px]" },
  },
  {
    accessorKey: "teamName",
    header: "Team",
    size: 180,
    cell: ({ row }) => row.original.teamName || "—",
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
    accessorKey: "reason",
    header: "Reason",
    size: 250,
    cell: ({ row }) => row.original.reason || "—",
    meta: { className: "truncate max-w-[250px]" },
  },
  {
    accessorKey: "createdAt",
    header: "Submitted",
    size: 180,
    cell: ({ row }) => formatDateTime(row.original.createdAt),
    meta: { className: "truncate max-w-[150px]" },
  },
]
