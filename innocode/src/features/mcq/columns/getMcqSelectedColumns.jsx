import { ExpandColumn } from "../../../shared/components/ExpandColumn"
import { ChevronRight, Trash2 } from "lucide-react"
import { formatDateTime } from "../../../shared/utils/dateTime"

export const getMcqSelectedColumns = (deselectQuestion) => [
  {
    header: "Question text",
    accessorKey: "text",
    cell: ({ row, getValue }) => {
      const isExpanded = row.getIsExpanded()

      return (
        <div className="flex items-center gap-2">
          {/* Expand toggle */}
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

          {/* Question text */}
          <span>{getValue() || "Untitled Question"}</span>
        </div>
      )
    },
    size: 600,
  },
  {
    header: "Options",
    accessorKey: "optionsCount",
    cell: (info) => `${info.getValue()} options`,
    size: 100,
  },
  {
    header: "Created at",
    accessorKey: "createdAt",
    cell: ({ row }) => formatDateTime(row.original?.createdAt),
    size: 180,
  },
  {
    id: "deselect",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => deselectQuestion(row.original.questionId)}
          title="Deselect question"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
    size: 40,
  },
]
