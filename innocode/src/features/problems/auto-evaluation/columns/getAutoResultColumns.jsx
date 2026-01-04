import StatusBadge from "../../../../shared/components/StatusBadge"
import { formatDateTime } from "../../../../shared/utils/dateTime"

const getAutoResultColumns = (t) => [
  {
    header: t("common.student"),
    accessorKey: "submittedByStudentName",
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row, getValue }) => <span className="truncate">{getValue()}</span>,
  },
  {
    accessorKey: "teamName",
    header: t("team.teamName"),
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row }) => row.original.teamName || "—",
  },
  {
    accessorKey: "status",
    header: t("common.status"),
    size: 120,
    meta: { className: "truncate max-w-[120px]" },
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "score",
    header: t("common.score"),
    size: 80,
    meta: { className: "" },
  },
  {
    accessorKey: "submissionAttemptNumber",
    header: t("common.attempts"),
    size: 90,
    meta: { className: "" },
  },
  {
    accessorKey: "createdAt",
    header: t("common.submittedAt"),
    size: 200,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row }) => formatDateTime(row.original.createdAt),
  },
]

export default getAutoResultColumns
