import { ExpandColumn } from "../../../shared/components/ExpandColumn"

export const getMcqPreviewColumns = (selectedQuestions, toggleSelect) => [
  ExpandColumn,
  {
    id: "select",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-center items-center h-full">
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
]
