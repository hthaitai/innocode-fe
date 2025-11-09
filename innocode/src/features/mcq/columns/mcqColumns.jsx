import Actions from "@/shared/components/Actions"
import { Edit } from "lucide-react"

export const getMcqColumns = (handleEditWeight) => [
  { header: "#", accessorKey: "displayId", size: 50 },
  {
    header: "Question",
    accessorKey: "text",
    cell: (info) => info.getValue() || "Untitled Question",
  },
  {
    header: "Weight",
    accessorKey: "weight",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    header: "",
    id: "actions",
    cell: ({ row }) => (
      <Actions
        row={row.original}
        items={[
          { label: "Edit Weight", icon: Edit, onClick: handleEditWeight },
        ]}
      />
    ),
  },
]
