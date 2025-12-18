import React from "react"
import { formatDateTime } from "../../../shared/utils/dateTime"
import { EyeIcon } from "lucide-react"

export const getTeamIssuedCertificatesColumns = () => [
  {
    accessorKey: "templateName",
    header: "Template name",
    size: 320,
    cell: ({ row }) => row.original?.templateName || "—",
    meta: { className: "truncate max-w-[320px]" },
  },
  {
    accessorKey: "teamName",
    header: "Team name",
    size: 320,
    cell: ({ row }) => row.original?.teamName || "—",
    meta: { className: "truncate max-w-[320px]" },
  },
  {
    accessorKey: "issuedAt",
    header: "Issued at",
    size: 180,
    cell: ({ row }) =>
      row.original?.issuedAt ? formatDateTime(row.original.issuedAt) : "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "fileUrl",
    header: "",
    size: 60,
    cell: ({ row }) =>
      row.original?.fileUrl ? (
        <a
          href={row.original.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <EyeIcon size={16} />
        </a>
      ) : (
        "—"
      ),
    meta: { className: "truncate max-w-[60px] flex items-center justify-end" },
  },
]
