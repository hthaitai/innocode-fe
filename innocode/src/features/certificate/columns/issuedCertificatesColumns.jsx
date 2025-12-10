import React from "react"
import { formatDateTime } from "../../../shared/utils/dateTime"

export const getIssuedCertificatesColumns = () => [
  {
    accessorKey: "templateName",
    header: "Template",
    size: 220,
    cell: ({ row }) => row.original?.templateName || "—",
    meta: { className: "truncate max-w-[220px]" },
  },
  {
    accessorKey: "teamName",
    header: "Team",
    size: 240,
    cell: ({ row }) => row.original?.teamName || "—",
    meta: { className: "truncate max-w-[240px]" },
  },
  {
    accessorKey: "studentName",
    header: "Student",
    size: 220,
    cell: ({ row }) => row.original?.studentName || "—",
    meta: { className: "truncate max-w-[220px]" },
  },
  {
    accessorKey: "issuedAt",
    header: "Issued At",
    size: 200,
    cell: ({ row }) =>
      row.original?.issuedAt ? formatDateTime(row.original.issuedAt) : "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    accessorKey: "fileUrl",
    header: "File",
    size: 140,
    cell: ({ row }) =>
      row.original?.fileUrl ? (
        <a
          href={row.original.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-600 hover:underline"
        >
          View
        </a>
      ) : (
        "—"
      ),
    meta: { className: "truncate max-w-[140px]" },
  },
]
