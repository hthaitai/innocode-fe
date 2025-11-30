import React from "react"
import { Download, Edit2 } from "lucide-react"
import StatusBadge from "@/shared/components/StatusBadge"
import Actions from "../../../shared/components/Actions"

export const getJudgeSubmissionsColumns = (
  handleRubricEvaluation
) => [
  {
    header: "Student",
    accessorKey: "submitedByStudentName",
    size: 200,
    cell: ({ row }) => row.original?.submitedByStudentName || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    header: "Team",
    accessorKey: "teamName",
    size: 150,
    cell: ({ row }) => row.original?.teamName || "—",
    meta: { className: "truncate max-w-[150px]" },
  },
  {
    header: "Round",
    accessorKey: "roundName",
    size: 120,
    cell: ({ row }) => row.original?.roundName || "—",
    meta: { className: "truncate max-w-[120px]" },
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 120,
    cell: ({ row }) => <StatusBadge status={row.original?.status} />,
    meta: { className: "truncate max-w-[120px]" },
  },
  {
    header: "Judge",
    accessorKey: "judgeEmail",
    size: 200,
    cell: ({ row }) => row.original?.judgeEmail || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    id: "actions",
    header: "",
    size: 80,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <Actions
        row={row.original}
        items={[
          {
            label: "Rubric evaluation",
            icon: Edit2,
            onClick: () => handleRubricEvaluation(row.original.submissionId),
          },
        ]}
      />
    ),
    meta: { className: "text-right w-[80px]" },
  },
]
