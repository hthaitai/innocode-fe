import Actions from "@/shared/components/Actions"
import { Edit2, Trash2 } from "lucide-react"

export const getRubricColumns = (handleEdit, handleDelete) => [
  {
    accessorKey: "description",
    header: "Description",
    size: 600,
    cell: ({ row }) => row.original?.description || "—",
    meta: { className: "truncate max-w-[360px]" },
  },
  {
    accessorKey: "maxScore",
    header: "Max score",
    size: 120,
    cell: ({ row }) => row.original?.maxScore ?? "—",
    meta: { className: "truncate max-w-[120px]" },
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
    meta: { className: "text-right w-[60px]" },
  },
]
