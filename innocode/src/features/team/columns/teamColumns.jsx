import { formatDateTime } from "@/shared/utils/dateTime"

export const getTeamColumns = () => [
  {
    accessorKey: "name",
    header: "Team",
    size: 220,
    cell: ({ row }) => row.original.name || "—",
    meta: { className: "truncate max-w-[220px]" },
  },
  {
    accessorKey: "schoolName",
    header: "School",
    size: 220,
    cell: ({ row }) => row.original.schoolName || "—",
    meta: { className: "truncate max-w-[220px]" },
  },
  {
    accessorKey: "mentorName",
    header: "Mentor",
    size: 200,
    cell: ({ row }) => row.original.mentorName || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    size: 180,
    cell: ({ row }) =>
      row.original.createdAt ? formatDateTime(row.original.createdAt) : "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "members",
    header: "Members",
    size: 100,
    cell: ({ row }) => row.original.members?.length || 0,
    meta: { className: "truncate max-w-[100px]" },
  },
]
