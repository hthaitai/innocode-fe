import Actions from "@/shared/components/Actions"
import { ChevronRight, Edit } from "lucide-react"
import { motion } from "framer-motion"
import { ExpandColumn } from "../../../shared/components/ExpandColumn"

export const getMcqColumns = (handleEditWeight) => [
  ExpandColumn,
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
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Actions
        row={row.original}
        items={[
          {
            label: "Edit Weight",
            icon: Edit,
            onClick: (itemRow) => {
              // itemRow === row.original
              handleEditWeight(itemRow)
            },
          },
        ]}
        onClick={(e) => e.stopPropagation()} // prevent expand when clicking menu
      />
    ),
  },
]
