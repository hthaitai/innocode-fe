import StatusBadge from "@/shared/components/StatusBadge"

const formatDate = (dateString, locale = "en-US") => {
  if (!dateString) return "-"
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
  } catch {
    return dateString
  }
}

export const getOrganizerContestsColumns = (t) => [
  {
    accessorKey: "name",
    header: t("dashboard.contests.table.name", "Contest Name"),
    cell: ({ row }) => (
      <span className="text-body-1 text-gray-800">
        {row.original?.name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: t("dashboard.contests.table.status", "Status"),
    cell: ({ row }) => (
      <StatusBadge status={row.original?.status} translate={true} />
    ),
  },
  {
    accessorKey: "startDate",
    header: t("dashboard.contests.table.startDate", "Start Date"),
    cell: ({ row }) => (
      <span className="text-body-1 text-gray-600">
        {formatDate(row.original?.startDate)}
      </span>
    ),
  },
  {
    accessorKey: "endDate",
    header: t("dashboard.contests.table.endDate", "End Date"),
    cell: ({ row }) => (
      <span className="text-body-1 text-gray-600">
        {formatDate(row.original?.endDate)}
      </span>
    ),
  },
  {
    accessorKey: "totalTeams",
    header: t("dashboard.contests.table.teams", "Teams"),
    cell: ({ row }) => (
      <span className="text-body-1 text-gray-600">
        {row.original?.totalTeams || 0}
      </span>
    ),
  },
]
