import { ExpandColumn } from "../../../shared/components/ExpandColumn"
import { Trash2 } from "lucide-react"

export const getMcqSelectedColumns = (deselectQuestion) => [
  ExpandColumn,
  {
    header: "Question Text",
    accessorKey: "text",
    cell: (info) => info.getValue() || "Untitled Question",
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
