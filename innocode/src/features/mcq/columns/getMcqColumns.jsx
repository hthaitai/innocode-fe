import Actions from "@/shared/components/Actions"
import { ChevronRight, Edit } from "lucide-react"

export const getMcqColumns = (handleEditWeight) => [
  {
    header: "Question",
    accessorKey: "text",
    size: 700,
    cell: ({ row, getValue }) => {
      const isExpanded = row.getIsExpanded()
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              row.toggleExpanded()
            }}
            className={`p-0 flex items-center justify-center rounded select-none text-[#7A7574] hover:text-black ${
              isExpanded ? "rotate-90" : "rotate-0"
            }`}
            aria-label={isExpanded ? "Collapse" : "Expand"}
            style={{ transition: "none" }}
          >
            <ChevronRight size={16} />
          </button>
          <span>{getValue() || "Untitled Question"}</span>
        </div>
      )
    },
  },
  {
    header: "Weight",
    accessorKey: "weight",
    size: 120,
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
        onClick={(e) => e.stopPropagation()} 
      />
    ),
    meta: { className: "text-right w-[60px]" },
  },
]
