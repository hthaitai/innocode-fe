import React from "react"
import {
  useDeleteCertificateTemplateMutation,
  useEditCertificateTemplateMutation,
  useGetCertificateTemplatesQuery,
} from "../../../../services/certificateApi"
import TemplatePreviewCanvas from "./TemplatePreviewCanvas"
import { Award, MoreHorizontal, Plus } from "lucide-react"
import { StatusMessage } from "../../../../shared/components/status/StatusMessage"
import TemplateActions from "./TemplateActions"
import { useNavigate, useParams } from "react-router-dom"
import { useModal } from "../../../../shared/hooks/useModal"

export default function ExistingTemplates({ contestId }) {
  const navigate = useNavigate()
  const { openModal } = useModal()

  const { data, isLoading, error } = useGetCertificateTemplatesQuery({
    pageNumber: 1,
    pageSize: 50,
  })
  const [deleteCertificateTemplate] = useDeleteCertificateTemplateMutation()

  const templates = data?.data ?? []

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
          onClose()
        } catch (err) {
          console.error("Failed to delete template:", err)
        }
      },
    })
  }

  return (
    <div>
      {/* Status messages */}
      <StatusMessage
        isLoading={isLoading}
        error={error}
        dataLength={templates.length}
      />

      {/* Grid for all cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Add New Template Card */}
        <div
          onClick={() =>
            navigate(
              `/organizer/contests/${contestId}/certificates/templates/new`
            )
          }
          className="flex flex-col justify-center items-center rounded-[5px] border border-dashed border-[#E5E5E5] bg-white aspect-video cursor-pointer hover:bg-gray-50 transition"
        >
          <Plus size={32} className="text-[#7A7574] mb-2" />
          <span className="text-sm font-medium text-[#7A7574]">
            Add New Template
          </span>
        </div>

        {/* Only render existing templates if they exist */}
        {templates.length > 0 &&
          templates.map((tpl) => (
            <div
              key={tpl.templateId}
            >
              {/* Image container — locked to 16:9 */}
              <div className="mb-3 border border-[#E5E5E5] rounded-[5px]  relative w-full aspect-video bg-gray-100 overflow-hidden rounded-t-[5px]">
                <TemplatePreviewCanvas template={tpl} />
              </div>

              {/* Name below — no border */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex gap-2">
                  <Award size={20} />
                  <h3 className="text-sm leading-5 line-clamp-2">{tpl.name}</h3>
                </div>

                {/* Dropdown for edit/delete */}
                <TemplateActions
                  template={tpl}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
