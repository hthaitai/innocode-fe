import React from "react"
import Actions from "@/shared/components/Actions"
import { Download, Trash2, FileBadge } from "lucide-react"

export const getCertificateColumns = (handleViewCertificate, handleIssue, handleRevoke) => [
  { accessorKey: "templateId", header: "Template ID" },
  { accessorKey: "templateName", header: "Template" },
  { accessorKey: "teamName", header: "Team" },
  {
    accessorKey: "issuedAt",
    header: "Issued At",
    cell: ({ row }) => new Date(row.original.issuedAt).toLocaleString(),
  },
  {
    accessorKey: "fileUrl",
    header: "File",
    cell: ({ row }) =>
      row.original.fileUrl ? (
        <a
          href={row.original.fileUrl}
          target="_blank"
          className="text-orange-600 hover:underline"
        >
          View File
        </a>
      ) : (
        "—"
      ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <Actions
        row={row.original}
        items={[
          {
            label: "Download",
            icon: Download,
            onClick: () => handleViewCertificate(row.original),
          },
          {
            label: "Issue",
            icon: FileBadge,
            onClick: handleIssue,
            className: "text-gray-400",
          },
          {
            label: "Revoke",
            icon: Trash2,
            onClick: handleRevoke,
            className: "text-gray-400",
          },
        ]}
      />
    ),
  },
]
