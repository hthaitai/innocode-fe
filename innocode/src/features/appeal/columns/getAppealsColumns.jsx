import Actions from "@/shared/components/Actions"
import { formatDateTime } from "@/shared/utils/dateTime"
import { FileText } from "lucide-react"

export const getAppealsColumns = (handleReview) => [
  {
    accessorKey: "ownerName",
    header: "Mentor",
    size: 160,
    cell: ({ row }) => row.original.ownerName || "—",
    meta: { className: "truncate max-w-[160px]" },
  },

  {
    accessorKey: "roundName",
    header: "Round",
    size: 160,
    cell: ({ row }) => row.original.roundName || "—",
    meta: { className: "truncate max-w-[260px]" },
  },

  {
    accessorKey: "reason",
    header: "Reason",
    size: 320,
    cell: ({ row }) => row.original.reason || "—",
    meta: { className: "truncate max-w-[320px]" },
  },

  {
    accessorKey: "createdAt",
    header: "Submitted",
    size: 160,
    cell: ({ row }) => formatDateTime(row.original.createdAt),
    meta: { className: "truncate max-w-[140px]" },
  },

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
            label: "Review",
            icon: FileText,
            onClick: () => handleReview(row.original),
          },
        ]}
      />
    ),
    meta: { className: "text-right w-[60px]" },
  },
]
