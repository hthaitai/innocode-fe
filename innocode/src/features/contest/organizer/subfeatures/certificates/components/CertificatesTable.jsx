import React from "react"
import { Award, Download, Trash2 } from "lucide-react"
import TableFluent from "@/shared/components/TableFluent"
import { useModal } from "@/features/organizer/hooks/useModal"
import Actions from "@/features/contest/components/Actions"
import useCertificates from "@/features/certificate/hooks/useCertificates"
import useCertificateTemplates from "@/features/certificate/hooks/useCertificateTemplates"
import useTeams from "@/features/team/hooks/useTeams"

export default function CertificatesTable() {
  const { openModal } = useModal()
  const { certificates, loading, error, revokeCertificate } = useCertificates()
  const { certificateTemplates } = useCertificateTemplates()
  const { teams } = useTeams()

  const handleViewCertificate = (certificate) => {
    if (!certificate.file_url) return
    window.open(certificate.file_url, "_blank")
  }

  const handleRevoke = (certificate) => {
    openModal("confirmDelete", {
      type: "certificate",
      item: certificate,
      message:
        "Revoking a certificate will remove access for the recipient. Are you sure?",
      onConfirm: async (onClose) => {
        await revokeCertificate(certificate.certificate_id)
        onClose()
      },
    })
  }

  const certificateColumns = [
    { accessorKey: "certificate_id", header: "ID" },
    {
      accessorKey: "template_name",
      header: "Template",
      cell: ({ row }) =>
        certificateTemplates.find(
          (t) => t.template_id === row.original.template_id
        )?.name || "—",
    },
    {
      accessorKey: "team_id",
      header: "Team",
      cell: ({ row }) =>
        teams.find((t) => t.team_id === row.original.team_id)?.name || "—",
    },
    {
      accessorKey: "issued_at",
      header: "Issued At",
      cell: ({ row }) =>
        new Date(row.original.issued_at).toLocaleString(),
    },
    {
      accessorKey: "file_url",
      header: "File",
      cell: ({ row }) =>
        row.original.file_url ? (
          <a
            href={row.original.file_url}
            target="_blank"
            rel="noopener noreferrer"
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
              label: "Revoke",
              icon: Trash2,
              className: "text-red-500",
              onClick: () => handleRevoke(row.original),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="space-y-1">
      {/* Header Section */}
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
        <div className="flex gap-5 items-center">
          <Award size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">Certificates</p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              View and manage all certificates
            </p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <TableFluent
        data={certificates}
        columns={certificateColumns}
        title="Certificates"
        loading={loading}
        error={error}
      />
    </div>
  )
}
