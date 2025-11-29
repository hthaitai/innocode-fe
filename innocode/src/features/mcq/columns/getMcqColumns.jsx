import Actions from "@/shared/components/Actions"
import { ChevronRight, Edit } from "lucide-react"
import { motion } from "framer-motion"
import { ExpandColumn } from "../../../shared/components/ExpandColumn"

export const getMcqColumns = (handleEditWeight) => [
  ExpandColumn,
  {
    header: "Question",
    accessorKey: "text",
    size: 400,
    cell: (info) => info.getValue() || "Untitled Question",
    meta: { className: "truncate max-w-[400px]" },
  },
  {
    header: "Weight",
    accessorKey: "weight",
    size: 80,
    cell: (info) => info.getValue() ?? "-",
    meta: { className: "truncate max-w-[80px]" },
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
            label: "Edit Weight",
            icon: Edit,
            onClick: (itemRow) => {
              handleEditWeight(itemRow)
            },
          },
        ]}
        onClick={(e) => e.stopPropagation()} // prevent expand when clicking menu
      />
    ),
    meta: { className: "text-right w-[60px]" }, // no truncate needed
  },
]
