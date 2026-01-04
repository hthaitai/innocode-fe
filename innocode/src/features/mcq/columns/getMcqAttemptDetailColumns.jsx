export const getMcqAttemptDetailColumns = (t) => [
  {
    header: t("common.question"),
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
    header: t("common.selectedAnswer"),
    accessorKey: "selectedOptionText",
    size: 200,
    cell: ({ row }) => row.original.selectedOptionText ?? "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    header: t("common.result"),
    accessorKey: "isCorrect",
    size: 150,
    cell: ({ row }) => {
      const status = row.original.isCorrect
        ? t("common.correct")
        : t("common.incorrect")
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
