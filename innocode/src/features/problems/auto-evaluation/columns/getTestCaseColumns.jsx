import { Pencil, Trash2 } from "lucide-react"
import Actions from "@/shared/components/Actions"

const getTestCaseColumns = (t, handleEditTestCase, handleDeleteTestCase) => [
  {
    accessorKey: "description",
    header: t("common.description"),
    size: 250,
    meta: { className: "truncate max-w-[300px]" },
    cell: ({ row }) => row.original.description || "—",
  },
  {
    accessorKey: "input",
    header: t("common.input"),
    size: 160,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row }) => row.original.input || "—",
  },
  {
    accessorKey: "expectedOutput",
    header: t("common.expectedOutput"),
    size: 160,
    meta: { className: "truncate max-w-[200px]" },
    cell: ({ row }) => row.original.expectedOutput || "—",
  },
  { accessorKey: "weight", header: t("common.weight"), size: 110 },
  { accessorKey: "timeLimitMs", header: t("common.timeMs"), size: 140 },
  { accessorKey: "memoryKb", header: t("common.memoryKb"), size: 130 },
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
            label: t("buttons.edit"),
            icon: Pencil,
            onClick: () => handleEditTestCase(row.original),
          },
          {
            label: t("buttons.delete"),
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
