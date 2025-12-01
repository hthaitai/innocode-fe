import { ChevronRight } from "lucide-react"
import { ExpandColumn } from "../../../shared/components/ExpandColumn"

export const getMcqPreviewColumns = (selectedQuestions, toggleSelect) => [
  {
    id: "select",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={
            !!selectedQuestions.find(
              (q) => q.questionId === row.original.questionId
            )
          }
          onChange={() => toggleSelect(row.original)}
          className="text-[#E05307] accent-[#E05307]"
        />
      </div>
    ),
    size: 40,
  },
  {
    header: "Question Text",
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
            className={`flex items-center justify-center rounded select-none text-[#7A7574] hover:text-black ${
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
  },
  {
    header: "Options",
    accessorKey: "optionsCount",
    cell: (info) => `${info.getValue()} options`,
    size: 100,
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: (info) =>
      info.getValue() ? new Date(info.getValue()).toLocaleDateString() : "-",
    size: 120,
  },
]
