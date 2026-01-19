import { formatDateTime } from "@/shared/utils/dateTime"
import StatusBadge from "@/shared/components/StatusBadge"

export const getTeamColumns = (t) => [
  {
    accessorKey: "name",
    header: t ? t("teams.table.team") : "Team",
    size: 250,
    cell: ({ row }) => row.original.name || "—",
    meta: { className: "truncate max-w-[250px]" },
  },
  {
    accessorKey: "schoolName",
    header: t ? t("teams.table.school") : "School",
    size: 280,
    cell: ({ row }) => row.original.schoolName || "—",
    meta: { className: "truncate max-w-[280px]" },
  },
  {
    accessorKey: "mentorName",
    header: t ? t("teams.table.mentor") : "Mentor",
    size: 200,
    cell: ({ row }) => row.original.mentorName || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "status",
    header: t ? t("teams.table.status") : "Status",
    size: 140,
    cell: ({ row }) => (
      <StatusBadge status={row.original.status || "Active"} translate="team" />
    ),
    meta: { className: "truncate max-w-[140px]" },
  },
  {
    accessorKey: "members",
    header: t ? t("teams.table.members") : "Members",
    size: 120,
    cell: ({ row }) => row.original.members?.length || 0,
    meta: { className: "truncate max-w-[120px]" },
  },
]
