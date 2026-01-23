import { formatDateTime } from "@/shared/utils/dateTime"
import { Download } from "lucide-react"

import Actions from "@/shared/components/Actions"

export const getMatchedSubmissionsColumns = (t, handleDownload) => [
  {
    accessorKey: "studentName",
    header: t("plagiarism:student"),
    size: 200,
    cell: ({ row }) => row.original.studentName || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "teamName",
    header: t("plagiarism:team"),
    size: 180,
    cell: ({ row }) => row.original.teamName || "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "score",
    header: t("plagiarism:score"),
    size: 100,
    cell: ({ row }) => {
      const score = row.original.score
      return score !== undefined && score !== null ? score.toString() : "—"
    },
  },
  {
    accessorKey: "submittedAt",
    header: t("plagiarism:submittedAt"),
    size: 180,
    cell: ({ row }) => formatDateTime(row.original.submittedAt),
    meta: { className: "truncate max-w-[150px]" },
  },
  {
    id: "actions",
    header: "",
    size: 80,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const artifact = row.original.artifacts?.[0]
      if (!artifact) return null

      return (
        <Actions
          row={row.original}
          items={[
            {
              label: t("common:buttons.download"),
              icon: Download,
              onClick: () =>
                handleDownload(
                  artifact.url,
                  `submission-${artifact.artifactId}.${artifact.url
                    .split(".")
                    .pop()}`,
                ),
            },
          ]}
        />
      )
    },
    meta: { className: "text-right w-[80px]" },
  },
]
