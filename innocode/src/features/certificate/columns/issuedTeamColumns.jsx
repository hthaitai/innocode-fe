import React from "react"
import { formatDateTime } from "../../../shared/utils/dateTime"
import { EyeIcon } from "lucide-react"

export const getTeamIssuedCertificatesColumns = (t) => [
  {
    accessorKey: "templateName",
    header: t("certificate:issued.templateName"),
    size: 320,
    cell: ({ row }) => row.original?.templateName || "—",
    meta: { className: "truncate max-w-[320px]" },
  },
  {
    accessorKey: "teamName",
    header: t("certificate:issued.teamName"),
    size: 320,
    cell: ({ row }) => row.original?.teamName || "—",
    meta: { className: "truncate max-w-[320px]" },
  },
  {
    accessorKey: "issuedAt",
    header: t("certificate:issued.issuedAt"),
    size: 180,
    cell: ({ row }) =>
      row.original?.issuedAt ? formatDateTime(row.original.issuedAt) : "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "fileUrl",
    header: "",
    size: 60,
    cell: ({ row }) => (
      <div className="w-full flex justify-end">
        {row.original?.fileUrl ? (
          <a
            href={row.original.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E05307] hover:underline"
          >
            {t("certificate:issued.view")}
          </a>
        ) : (
          "—"
        )}
      </div>
    ),
    meta: { className: "truncate" },
  },
]
