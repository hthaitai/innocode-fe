import { formatDateTime } from "@/shared/utils/dateTime"

export const getAppealsColumns = (t) => [
  {
    accessorKey: "ownerName",
    header: t("student"),
    size: 180,
    cell: ({ row }) => row.original.ownerName || "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "roundName",
    header: t("round"),
    size: 240,
    cell: ({ row }) => row.original.roundName || "—",
    meta: { className: "truncate max-w-[150px]" },
  },
  {
    accessorKey: "reason",
    header: t("reason"),
    size: 320,
    cell: ({ row }) => row.original.reason || "—",
    meta: { className: "truncate max-w-[380px]" },
  },
  {
    accessorKey: "createdAt",
    header: t("submitted"),
    size: 250,
    cell: ({ row }) => formatDateTime(row.original.createdAt),
    meta: { className: "truncate max-w-[250px]" },
  },
]
