import { ChevronRight } from "lucide-react"
import { ExpandColumn } from "../../../shared/components/ExpandColumn"
import { formatDateTime } from "../../../shared/utils/dateTime"

export const getMcqPreviewColumns = (
  selectedQuestions,
  toggleSelect,
  toggleSelectAll,
  isAllSelected,
  t
) => [
  {
    id: "select",
    header: () => (
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={toggleSelectAll}
          className="text-[#E05307] accent-[#E05307]"
        />
      </div>
    ),
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
    size: 50,
  },
  {
    header: t("common.questionText"),
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
            aria-label={isExpanded ? t("common.collapse") : t("common.expand")}
            style={{ transition: "none" }}
          >
            <ChevronRight size={16} />
          </button>

          {/* Question text */}
          <span>{getValue() || t("common.untitledQuestion")}</span>
        </div>
      )
    },
    size: 600,
  },
  {
    header: t("common.options"),
    accessorKey: "optionsCount",
    cell: (info) => t("common.optionsCount", { count: info.getValue() }),
    size: 100,
  },
  {
    header: t("common.createdAt"),
    accessorKey: "createdAt",
    cell: ({ row }) => formatDateTime(row.original?.createdAt),
    size: 180,
  },
]
