import React from "react"
import { useNavigate } from "react-router-dom"
import TemplatePreviewCanvas from "./TemplatePreviewCanvas"
import TemplateActions from "./TemplateActions"
import CertificateTemplatesToolbar from "./CertificateTemplatesToolbar"
import TablePagination from "@/shared/components/TablePagination"
import { useModal } from "@/shared/hooks/useModal"
import { useDeleteCertificateTemplateMutation } from "../../../../services/certificateApi"
import toast from "react-hot-toast"
import { MissingState } from "@/shared/components/ui/MissingState"

import { useTranslation } from "react-i18next"

const ManageCertificateTemplates = ({
  contestId,
  templates,
  pagination,
  setPageNumber,
}) => {
  const { t } = useTranslation(["certificate", "contest"])
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
      message: t("certificate:deleteConfirm", { name: tpl.name }),
      onConfirm: async (onClose) => {
        try {
          await deleteCertificateTemplate(tpl.templateId).unwrap()
          toast.success(t("certificate:deleteSuccess", { name: tpl.name }))
          onClose()
        } catch (err) {
          console.error("Failed to delete template:", err)
          toast.error(t("certificate:deleteError", { name: tpl.name }))
        }
      },
    })
  }

  return (
    <div>
      <CertificateTemplatesToolbar contestId={contestId} />

      {templates.length === 0 ? (
        <div
          className={`text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]`}
        >
          {t("contest:certificate.noTemplates")}
        </div>
      ) : (
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
      )}

      {templates.length > 0 && (
        <TablePagination pagination={pagination} onPageChange={setPageNumber} />
      )}
    </div>
  )
}

export default ManageCertificateTemplates
