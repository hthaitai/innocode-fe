export const getMcqAttemptDetailColumns = () => [
  {
    header: "#",
    accessorKey: "index",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Question",
    accessorKey: "questionText",
    cell: ({ row }) => (
      <div className="truncate max-w-lg" title={row.original.questionText}>
        {row.original.questionText}
      </div>
    ),
  },
  {
    header: "Selected Answer",
    accessorKey: "selectedOptionText",
    cell: ({ row }) => row.original.selectedOptionText ?? "—",
  },
  {
    header: "Result",
    accessorKey: "isCorrect",
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
  },
]
