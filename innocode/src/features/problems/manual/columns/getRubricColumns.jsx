import Actions from "@/shared/components/Actions"
import { Edit2, Trash2 } from "lucide-react"

// ✅ pure utility function — no hooks
export const getRubricColumns = (
  handleField,
  handleDelete,
  criteria,
  roundId,
  openModal
) => [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description || "—",
  },
  {
    accessorKey: "maxScore",
    header: "Max Score",
    cell: ({ row }) => row.original.maxScore ?? "—",
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
            onClick: () =>
              openModal("rubric", {
                roundId,
                criteria,
                initialData: row.original,
              }),
          },
          {
            label: "Delete",
            icon: Trash2,
            className: "text-red-500",
            onClick: () => handleDelete(row.original.rubricId, row.index),
          },
        ]}
      />
    ),
  },
]
