import StatusBadge from "@/shared/components/StatusBadge"
import { formatDateTime } from "@/shared/utils/dateTime"

export const getJudgeInviteColumns = () => [
  {
    header: "Judge name",
    accessorKey: "judgeName",
    size: 180,
    cell: ({ row }) => row.original?.judgeName || "—",
    meta: { className: "truncate" },
  },
  {
    header: "Judge email",
    accessorKey: "judgeEmail",
    size: 180,
    cell: ({ row }) => row.original?.judgeEmail || "—",
    meta: { className: "truncate" },
  },
  {
    header: "Invite status",
    accessorKey: "status",
    size: 140,
    cell: ({ row }) => (
      <StatusBadge status={row.original?.status || "PendingInvite"} />
    ),
    meta: { className: "truncate" },
  },
  {
    header: "TTL (days)",
    accessorKey: "ttlDays",
    size: 100,
    cell: ({ row }) => {
      const createdAt = row.original?.createdAt
      const expiresAt = row.original?.expiresAt
      if (!createdAt || !expiresAt) return "—"
      const diffTime = new Date(expiresAt) - new Date(createdAt)
      return diffTime > 0
        ? Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        : 0
    },
    meta: { className: "text-center" },
  },
  {
    header: "Created at",
    accessorKey: "createdAt",
    size: 160,
    cell: ({ row }) => formatDateTime(row.original?.createdAt),
    meta: { className: "truncate" },
  },
  {
    header: "Accepted at",
    accessorKey: "acceptedAt",
    size: 160,
    cell: ({ row }) =>
      row.original?.acceptedAt ? formatDateTime(row.original.acceptedAt) : "—",
    meta: { className: "truncate" },
  },
]
