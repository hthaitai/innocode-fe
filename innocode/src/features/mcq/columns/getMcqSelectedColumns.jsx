import { ExpandColumn } from "../../../shared/components/ExpandColumn"
import { ChevronRight, Trash2 } from "lucide-react"
import { formatDateTime } from "../../../shared/utils/dateTime"

export const getMcqSelectedColumns = (deselectQuestion, t) => [
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
            className={`p-0 flex items-center justify-center rounded select-none text-[#7A7574] hover:text-black ${
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
  {
    id: "deselect",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => deselectQuestion(row.original.questionId)}
          title={t("common.deselectQuestion")}
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
    size: 40,
  },
]
