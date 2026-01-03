import Actions from "@/shared/components/Actions"
import { Trash2, Edit2 } from "lucide-react"
import StatusBadge from "@/shared/components/StatusBadge"
import { formatDateTime } from "@/shared/utils/dateTime"

export const getContestColumns = (handleEdit, handleDelete, t) => [
  {
    accessorKey: "name",
    header: t("organizerContests.table.name"),
    size: 360,
    cell: ({ row }) => row.original?.name || "—",
    meta: { className: "truncate max-w-[360px]" },
  },
  {
    accessorKey: "year",
    header: t("organizerContests.table.year"),
    size: 80,
    cell: ({ row }) => row.original?.year || "—",
    meta: { className: "truncate max-w-[80px]" },
  },
  {
    accessorKey: "status",
    header: t("organizerContests.table.status"),
    size: 180,
    cell: ({ row }) => (
      <StatusBadge status={row.original?.status || "Draft"} translate={true} />
    ),
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "createdAt",
    header: t("organizerContests.table.createdAt"),
    size: 160,
    cell: ({ row }) => formatDateTime(row.original?.createdAt),
    meta: { className: "truncate max-w-[160px]" },
  },
  {
    id: "actions",
    header: "",
    size: 60,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <Actions
        row={row.original}
        items={[
          {
            label: t("organizerContests.table.edit"),
            icon: Edit2,
            onClick: () => handleEdit(row.original),
          },
          {
            label: t("organizerContests.table.delete"),
            icon: Trash2,
            className: "text-red-500",
            onClick: () => handleDelete(row.original),
          },
        ]}
      />
    ),
    meta: { className: "text-right w-[60px]" },
  },
]
