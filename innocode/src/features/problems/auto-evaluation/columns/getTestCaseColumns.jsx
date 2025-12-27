import { Pencil, Trash2 } from "lucide-react"
import Actions from "@/shared/components/Actions"

const getTestCaseColumns = (handleEditTestCase, handleDeleteTestCase) => [
  {
    accessorKey: "description",
    header: "Description",
    size: 250,
    meta: { className: "truncate max-w-[300px]" },
    cell: ({ row }) => row.original.description || "—",
  },
  {
    accessorKey: "input",
    header: "Input",
    size: 160,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row }) => row.original.input || "—",
  },
  {
    accessorKey: "expectedOutput",
    header: "Expected output",
    size: 160,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row }) => row.original.expectedOutput || "—",
  },
  { accessorKey: "weight", header: "Weight", size: 80 },
  { accessorKey: "timeLimitMs", header: "Time (ms)", size: 110 },
  { accessorKey: "memoryKb", header: "Memory (KB)", size: 130 },
  {
    id: "actions",
    header: "",
    size: 60,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <Actions
        row={row.original}
        items={[
          {
            label: "Edit",
            icon: Pencil,
            onClick: () => handleEditTestCase(row.original),
          },
          {
            label: "Delete",
            icon: Trash2,
            className: "text-red-500",
            onClick: () => handleDeleteTestCase(row.original),
          },
        ]}
      />
    ),
    meta: { className: "text-right w-[60px]" }, 
  },
]

export default getTestCaseColumns
