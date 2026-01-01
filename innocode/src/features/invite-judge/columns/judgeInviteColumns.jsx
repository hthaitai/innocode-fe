import Actions from "@/shared/components/Actions"
import { UserPlus, Repeat, Trash2, MoreHorizontal } from "lucide-react"
import StatusBadge from "@/shared/components/StatusBadge"
import { formatDateTime } from "@/shared/utils/dateTime"

const canInvite = (status) =>
  !status || ["cancelled", "revoked", "expired"].includes(status.toLowerCase())

const canResend = (status) => status?.toLowerCase() === "pending"
const canRevoke = (status) => status?.toLowerCase() === "pending"

export const getJudgeInviteColumns = ({
  onInvite,
  onResend,
  onRevoke,
} = {}) => [
  {
    accessorKey: "judgeName",
    header: "Name",
    size: 220,
    cell: ({ row }) => row.original.judgeName || "—",
    meta: { className: "truncate max-w-[220px]" },
  },
  {
    accessorKey: "judgeEmail",
    header: "Email",
    size: 240,
    cell: ({ row }) => row.original.judgeEmail || "—",
    meta: { className: "truncate max-w-[260px]" },
  },
  {
    accessorKey: "inviteStatus",
    header: "Invite status",
    size: 130,
    cell: ({ row }) => <StatusBadge status={row.original.inviteStatus} />,
    meta: { className: "truncate max-w-[110px]" },
  },
  {
    accessorKey: "invitedAt",
    header: "Invited at",
    size: 180,
    cell: ({ row }) => {
      const value = row.original.invitedAt
      return value ? (
        formatDateTime(value)
      ) : (
        <span className="text-[#7A7574]">Not invited</span>
      )
    },
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "expiresAt",
    header: "Expires at",
    size: 180,
    cell: ({ row }) => {
      const value = row.original.expiresAt
      return value ? (
        formatDateTime(value)
      ) : (
        <span className="text-[#7A7574]">No expiration</span>
      )
    },
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    id: "actions",
    header: "",
    size: 60,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const status = row.original.inviteStatus
      const items = []

      if (canInvite(status)) {
        items.push({
          label: "Invite",
          icon: UserPlus,
          onClick: () => onInvite?.(row.original),
        })
      }

      if (canResend(status)) {
        items.push({
          label: "Resend",
          icon: Repeat,
          onClick: () => onResend?.(row.original),
        })
      }

      if (canRevoke(status)) {
        items.push({
          label: "Revoke",
          icon: Trash2,
          className: "text-red-500",
          onClick: () => onRevoke?.(row.original),
        })
      }

      // 👉 No actions? Show disabled kebab icon.
      if (items.length === 0) return null

      return <Actions row={row.original} items={items} />
    },
    meta: { className: "text-right w-[60px]" },
  },
]
