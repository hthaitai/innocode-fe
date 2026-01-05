import { formatDateTime } from "@/shared/utils/dateTime"

export const getTeamColumns = (t) => [
  {
    accessorKey: "name",
    header: t ? t("teams.table.team") : "Team",
    size: 220,
    cell: ({ row }) => row.original.name || "—",
    meta: { className: "truncate max-w-[220px]" },
  },
  {
    accessorKey: "schoolName",
    header: t ? t("teams.table.school") : "School",
    size: 220,
    cell: ({ row }) => row.original.schoolName || "—",
    meta: { className: "truncate max-w-[220px]" },
  },
  {
    accessorKey: "mentorName",
    header: t ? t("teams.table.mentor") : "Mentor",
    size: 200,
    cell: ({ row }) => row.original.mentorName || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "createdAt",
    header: t ? t("teams.table.created") : "Created",
    size: 180,
    cell: ({ row }) =>
      row.original.createdAt ? formatDateTime(row.original.createdAt) : "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "members",
    header: t ? t("teams.table.members") : "Members",
    size: 120,
    cell: ({ row }) => row.original.members?.length || 0,
    meta: { className: "truncate max-w-[100px]" },
  },
]
