import StatusBadge from "../../../../shared/components/StatusBadge"
import { formatDateTime } from "../../../../shared/utils/dateTime"

const getAutoResultColumns = () => [
  {
    accessorKey: "teamName",
    header: "Team name",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row }) => row.original.teamName || "—",
  },
  {
    accessorKey: "submittedByStudentName",
    header: "Student name",
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
    header: "Attempts",
    size: 80,
    meta: { className: "" },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
]

export default getAutoResultColumns
