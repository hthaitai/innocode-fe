import React from "react"
import { useNavigate } from "react-router-dom"
import TemplatePreviewCanvas from "./TemplatePreviewCanvas"
import TemplateActions from "./TemplateActions"
import CertificateTemplatesToolbar from "./CertificateTemplatesToolbar"
import TablePagination from "@/shared/components/TablePagination"
import { useModal } from "@/shared/hooks/useModal"
import {
  useDeleteCertificateTemplateMutation,
} from "../../../../services/certificateApi"
import toast from "react-hot-toast"

const ManageCertificateTemplates = ({
  contestId,
  templates,
  pagination,
  setPageNumber,
}) => {
  const navigate = useNavigate()
  const { openModal } = useModal()
  const [deleteCertificateTemplate] = useDeleteCertificateTemplateMutation()

  const handleEdit = (tpl) => {
    navigate(
      `/organizer/contests/${contestId}/certificates/templates/${tpl.templateId}/edit`
    )
  }

  const handleDelete = async (tpl) => {
    openModal("confirmDelete", {
      item: tpl,
      message: `Are you sure you want to delete "${tpl.name}"?`,
      onConfirm: async (onClose) => {
        try {
          await deleteCertificateTemplate(tpl.templateId).unwrap()
          toast.success(`"${tpl.name}" has been deleted.`)
          onClose()
        } catch (err) {
          console.error("Failed to delete template:", err)
          toast.error(`Failed to delete "${tpl.name}". Please try again.`)
        }
      },
    })
  }

  return (
    <div>
      <CertificateTemplatesToolbar contestId={contestId} />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
        {templates.map((tpl) => (
          <div
            key={tpl.templateId}
            className="border border-[#E5E5E5] rounded-[5px]"
          >
            <div className="relative w-full aspect-video overflow-hidden">
              <TemplatePreviewCanvas template={tpl} />
            </div>

            <div className="flex items-center justify-between bg-white p-3 rounded-b-[5px]">
              <h3 className="text-sm leading-5 line-clamp-2 font-medium">
                {tpl.name}
              </h3>
              <TemplateActions
                template={tpl}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        ))}
      </div>

      <TablePagination pagination={pagination} onPageChange={setPageNumber} />
    </div>
  )
}

export default ManageCertificateTemplates

