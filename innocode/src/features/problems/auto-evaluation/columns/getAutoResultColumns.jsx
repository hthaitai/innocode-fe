import StatusBadge from "../../../../shared/components/StatusBadge"

const getAutoResultColumns = () => [
  {
    accessorKey: "teamName",
    header: "Team",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row }) => row.original.teamName || "—",
  },
  {
    accessorKey: "submittedByStudentName",
    header: "Student",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row }) => row.original.submittedByStudentName || "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    meta: { className: "truncate max-w-[120px]" },
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "score",
    header: "Score",
    size: 80,
    meta: { className: "" },
  },
  {
    accessorKey: "submissionAttemptNumber",
    header: "Attempt",
    size: 80,
    meta: { className: "" },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row }) => row.original.createdAt || "—",
  },
]

export default getAutoResultColumns
