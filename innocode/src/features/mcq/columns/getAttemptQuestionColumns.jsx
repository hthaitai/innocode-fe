export const getAttemptQuestionColumns = () => [
  {
    header: "#",
    accessorKey: "index",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Question",
    accessorKey: "questionText",
  },
  {
    header: "Selected Answer",
    accessorKey: "selectedOptionText",
    cell: ({ row }) => row.original.selectedOptionText ?? "—",
  },
  {
    header: "Result",
    accessorKey: "isCorrect",
    cell: ({ row }) =>
      row.original.isCorrect ? (
        <span className="text-green-700 font-semibold">✅ Correct</span>
      ) : (
        <span className="text-red-700 font-semibold">❌ Incorrect</span>
      ),
  },
]
