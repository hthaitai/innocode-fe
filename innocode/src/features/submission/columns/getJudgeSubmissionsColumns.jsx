import React from "react"
import { Download, Edit2 } from "lucide-react"
import StatusBadge from "@/shared/components/StatusBadge"
import Actions from "../../../shared/components/Actions"

export const getJudgeSubmissionsColumns = (handleRubricEvaluation, t) => [
  {
    header: t ? t("manualSubmissions.table.submission") : "Submission",
    accessorKey: "submissionNumber",
    size: 180,
    cell: ({ row }) => {
      // Use row index + 1 for human-readable numbering
      const submissionNumber = row.index + 1
      const submissionText = t
        ? t("manualSubmissions.table.submission")
        : "Submission"
      return `${submissionText} ${submissionNumber}`
    },
  },
  {
    header: t ? t("manualSubmissions.table.status") : "Status",
    accessorKey: "status",
    size: 140,
    cell: ({ row }) => <StatusBadge status={row.original?.status} />,
    meta: { className: "truncate max-w-[150px]" },
  },
  {
    header: t ? t("manualSubmissions.table.score") : "Score",
    accessorKey: "criterionResults",
    size: 140,
    cell: ({ row }) => {
      const results = row.original.criterionResults || []
      const totalScore = results.reduce((acc, r) => acc + (r.score || 0), 0)
      const maxScore = results.reduce((acc, r) => acc + (r.maxScore || 0), 0)
      return `${totalScore} / ${maxScore}`
    },
  },
  {
    id: "actions",
    header: "",
    size: 200,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <Actions
        row={row.original}
        items={[
          {
            label: t
              ? t("manualSubmissions.actions.rubricEvaluation")
              : "Rubric evaluation",
            icon: Edit2,
            onClick: () => handleRubricEvaluation(row.original.submissionId),
          },
        ]}
      />
    ),
    meta: { className: "text-right w-[220px]" },
  },
]
