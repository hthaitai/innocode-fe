import React from "react"
import { FileBadge, Pencil, Trash2 } from "lucide-react"
import TableFluent from "../../../TableFluent"
import { useModal } from "../../../../hooks/organizer/useModal"
import useCertificateTemplates from "../../../../hooks/organizer/contests/certificates/useCertificateTemplates"
import Actions from "../Actions"

export default function CertificateTemplatesTable() {
  const {
    certificateTemplates,
    loading,
    error,
    addCertificateTemplate,
    updateCertificateTemplate,
    deleteCertificateTemplate,
    issueCertificate,
  } = useCertificateTemplates()

  const { openModal } = useModal()

  // ----- CRUD Modals -----
  const handleTemplateModal = (mode, template = {}) => {
    openModal("certificateTemplate", {
      mode,
      initialData: template,
      onSubmit: async (data) => {
        if (mode === "create") return await addCertificateTemplate(data)
        if (mode === "edit")
          return await updateCertificateTemplate(template.template_id, data)
      },
    })
  }

  const handleDeleteTemplate = (template) => {
    openModal("confirmDelete", {
      type: "certificate template",
      item: template,
      onConfirm: async (onClose) => {
        await deleteCertificateTemplate(template.template_id)
        onClose()
      },
    })
  }

  const handleIssueCertificates = (template) => {
  openModal("issueCertificate", {
    template,
    onSubmit: async (recipient) => {
      // Wrap single recipient in array
      const recipientsArray = [recipient]
      await issueCertificate(template, recipientsArray)
    },
  })
}

  // ----- Table Columns -----
  const templateColumns = [
    { accessorKey: "name", header: "Name" },
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
              label: "Issue Certificates",
              icon: FileBadge,
              onClick: () => handleIssueCertificates(row.original),
            },
            {
              label: "Edit",
              icon: Pencil,
              onClick: () => handleTemplateModal("edit", row.original),
            },
            {
              label: "Delete",
              icon: Trash2,
              className: "text-red-500",
              onClick: () => handleDeleteTemplate(row.original),
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
          <FileBadge size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">
              Certificate Template Management
            </p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              Create, edit, and issue certificates from templates
            </p>
          </div>
        </div>
        <button
          className="button-orange"
          onClick={() => handleTemplateModal("create")}
        >
          New Template
        </button>
      </div>

      {/* Table Section */}
      <TableFluent
        data={certificateTemplates}
        columns={templateColumns}
        title="Certificate Templates"
        loading={loading}
        error={error}
      />
    </div>
  )
}
