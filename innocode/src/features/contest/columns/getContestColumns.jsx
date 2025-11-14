import Actions from "@/shared/components/Actions"
import { Trash2, Edit2 } from "lucide-react"
import StatusBadge from "@/shared/components/StatusBadge"
import { formatDateTime } from "@/shared/utils/dateTime"

export const getContestColumns = (handleEdit, handleDelete) => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original?.name || "—",
  },
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => row.original?.year || "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original?.status || "Draft"} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatDateTime(row.original?.createdAt),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <Actions
        row={row.original}
        items={[
          {
            label: "Edit",
            icon: Edit2,
            onClick: () => handleEdit(row.original),
          },
          {
            label: "Delete",
            icon: Trash2,
            className: "text-red-500",
            onClick: () => handleDelete(row.original),
          },
        ]}
      />
    ),
  },
]
