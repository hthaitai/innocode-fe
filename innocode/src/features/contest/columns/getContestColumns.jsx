import Actions from "@/shared/components/Actions"
import { Trash2, Edit2 } from "lucide-react"
import StatusBadge from "@/shared/components/StatusBadge"
import { formatDateTime } from "@/shared/utils/dateTime"

export const getContestColumns = (handleEdit, handleDelete) => [
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    cell: ({ row }) => row.original?.name || "—",
    meta: { className: "truncate max-w-[200px]" }, // ← truncate with max width
  },
  {
    accessorKey: "year",
    header: "Year",
    size: 40,
    cell: ({ row }) => row.original?.year || "—",
    meta: { className: "truncate max-w-[90px]" },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => <StatusBadge status={row.original?.status || "Draft"} />,
    meta: { className: "truncate max-w-[120px]" },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
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
    meta: { className: "text-right w-[60px]" }, // no truncate needed here
  },
]
