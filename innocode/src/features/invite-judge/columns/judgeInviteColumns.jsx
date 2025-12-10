import StatusBadge from "@/shared/components/StatusBadge"
import { formatDateTime } from "@/shared/utils/dateTime"

export const getJudgeInviteColumns = () => [
  {
    accessorKey: "judgeName",
    header: "Name",
    size: 240, // slightly smaller to account for padding
    cell: ({ row }) => row.original.judgeName || "—",
    meta: { className: "truncate max-w-[240px]" },
  },
  {
    accessorKey: "judgeEmail",
    header: "Email",
    size: 280, // slightly smaller to account for padding
    cell: ({ row }) => row.original.judgeEmail || "—",
    meta: { className: "truncate max-w-[280px]" },
  },
  {
    accessorKey: "inviteStatus",
    header: "Invite Status",
    size: 120, // enough for badge
    cell: ({ row }) => <StatusBadge status={row.original.inviteStatus} />,
    meta: { className: "truncate max-w-[100px]" },
  },
  {
    accessorKey: "invitedAt",
    header: "Invited At",
    size: 200, // enough for date
    cell: ({ row }) => formatDateTime(row.original.invitedAt),
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "expiresAt",
    header: "Expires At",
    size: 180, // enough for date
    cell: ({ row }) => formatDateTime(row.original.expiresAt),
    meta: { className: "truncate max-w-[180px]" },
  },
]
