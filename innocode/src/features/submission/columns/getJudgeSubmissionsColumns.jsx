import React from "react"
import { Download, Edit2 } from "lucide-react"
import StatusBadge from "@/shared/components/StatusBadge"
import Actions from "../../../shared/components/Actions"

export const getJudgeSubmissionsColumns = (handleRubricEvaluation) => [
  {
    header: "Student",
    accessorKey: "submitedByStudentName",
    size: 240, // rough 30%
    cell: ({ row }) => row.original?.submitedByStudentName || "—",
    meta: { className: "truncate max-w-[300px]" },
  },
  {
    header: "Team",
    accessorKey: "teamName",
    size: 220, // rough 20%
    cell: ({ row }) => row.original?.teamName || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 150, // rough 15%
    cell: ({ row }) => <StatusBadge status={row.original?.status} />,
    meta: { className: "truncate max-w-[150px]" },
  },
  {
    header: "Score",
    accessorKey: "criterionResults",
    size: 150, // rough 15%
    cell: ({ row }) => {
      const results = row.original.criterionResults || []
      const totalScore = results.reduce((acc, r) => acc + (r.score || 0), 0)
      const maxScore = results.reduce((acc, r) => acc + (r.maxScore || 0), 0)
      return `${totalScore} / ${maxScore}`
    },
    meta: { className: "truncate max-w-[150px]" },
  },
  {
    id: "actions",
    header: "",
    size: 200, // rough 20%, slightly bigger for buttons
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
    meta: { className: "text-right w-[220px]" },
  },
]
