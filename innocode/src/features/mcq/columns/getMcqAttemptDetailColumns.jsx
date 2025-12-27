export const getMcqAttemptDetailColumns = () => [
  {
    header: "#",
    accessorKey: "index",
    size: 50,
    cell: ({ row }) => row.index + 1,
    meta: { className: "text-left w-[50px]" },
  },
  {
    header: "Question",
    accessorKey: "questionText",
    size: 500, 
    cell: ({ row }) => (
      <div className="truncate max-w-[500px]" title={row.original.questionText}>
        {row.original.questionText}
      </div>
    ),
    meta: { className: "truncate max-w-[500px]" },
  },
  {
    header: "Selected answer",
    accessorKey: "selectedOptionText",
    size: 200,
    cell: ({ row }) => row.original.selectedOptionText ?? "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    header: "Result",
    accessorKey: "isCorrect",
    size: 150,
    cell: ({ row }) => {
      const status = row.original.isCorrect ? "Correct" : "Incorrect"
      return (
        <span className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              row.original.isCorrect ? "bg-green-600" : "bg-red-600"
            }`}
          />
          {status}
        </span>
      )
    },
    meta: { className: "truncate max-w-[150px]" },
  },
]
