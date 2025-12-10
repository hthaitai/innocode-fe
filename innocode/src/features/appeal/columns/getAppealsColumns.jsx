import Actions from "@/shared/components/Actions"
import StatusBadge from "@/shared/components/StatusBadge"
import { formatDateTime } from "@/shared/utils/dateTime"
import { Eye, Check, X, FileText } from "lucide-react"

export const getAppealsColumns = (handleReview) => [
  {
    accessorKey: "teamName",
    header: "Team",
    size: 220,
    cell: ({ row }) => row.original.teamName || "—",
    meta: { className: "truncate max-w-[220px]" },
  },
  {
    accessorKey: "targetType",
    header: "Type",
    size: 120,
    cell: ({ row }) => row.original.targetType || "—",
    meta: { className: "truncate max-w-[120px]" },
  },
  {
    accessorKey: "ownerName",
    header: "Owner",
    size: 180,
    cell: ({ row }) => row.original.ownerName || "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "state",
    header: "Status",
    size: 120,
    cell: ({ row }) => <StatusBadge status={row.original.state} />,
    meta: { className: "truncate max-w-[120px]" },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    size: 180,
    cell: ({ row }) => formatDateTime(row.original.createdAt),
    meta: { className: "truncate max-w-[160px]" },
  },
  {
    id: "evidences",
    header: "Evidence",
    size: 100,
    enableSorting: false,
    cell: ({ row }) => {
      const count = row.original.evidences?.length || 0
      return count > 0 ? (
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4 text-gray-500" />
          <span>{count}</span>
        </div>
      ) : (
        "—"
      )
    },
    meta: { className: "truncate max-w-[100px]" },
  },
  {
    id: "actions",
    header: "",
    size: 100,
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
    meta: { className: "text-right w-[100px]" },
  },
]
