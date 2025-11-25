export const getBankColumns = (selectedBanks, toggleSelectBank) => [
  {
    id: "select",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-center items-center h-full">
        <input
          type="checkbox"
          checked={
            !!selectedBanks.find((b) => b.bankId === row.original.bankId)
          }
          onChange={() => toggleSelectBank(row.original)}
          className="text-[#E05307] accent-[#E05307]"
        />
      </div>
    ),
    size: 50,
  },
  {
    id: "name",
    header: "Bank Name",
    accessorKey: "name",
    cell: (info) => info.getValue() || "Untitled Bank",
  },
  {
    id: "totalQuestions",
    header: "Total Questions",
    accessorKey: "totalQuestions",
    cell: (info) => `${info.getValue() || 0} questions`,
    size: 100,
  },
  {
    id: "createdAt",
    header: "Created At",
    accessorKey: "createdAt",
    cell: (info) =>
      info.getValue() ? new Date(info.getValue()).toLocaleDateString() : "-",
    size: 120,
  },
]
