import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import {
  useDeleteCertificateTemplateMutation,
  useGetCertificateTemplatesQuery,
} from "@/services/certificateApi"
import TemplatePreviewCanvas from "../../components/organizer/TemplatePreviewCanvas"
import TemplateActions from "../../components/organizer/TemplateActions"
import { useModal } from "@/shared/hooks/useModal"
import { Plus } from "lucide-react"
import toast from "react-hot-toast"
import TablePagination from "../../../../shared/components/TablePagination"

const OrganizerCertificateTemplates = () => {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const { openModal } = useModal()

  const [page, setPage] = useState(1)
  const pageSize = 8

  const {
    data: contest,
    isLoading: contestLoading,
    error: contestError,
  } = useGetContestByIdQuery(contestId)

  const contestName = contest?.name || "Contest"

  const breadcrumbItems =
    BREADCRUMBS.ORGANIZER_CERTIFICATE_TEMPLATES(contestName)
  const breadcrumbPaths =
    BREADCRUMB_PATHS.ORGANIZER_CERTIFICATE_TEMPLATES(contestId)

  const {
    data: templatesData,
    isLoading: templatesLoading,
    error: templatesError,
  } = useGetCertificateTemplatesQuery({ pageNumber: page, pageSize })
  const [deleteCertificateTemplate] = useDeleteCertificateTemplateMutation()

  const templates = templatesData?.data ?? []
  const pagination = templatesData?.additionalData

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
          toast.success(`"${tpl.name}" has been deleted.`) // success toast
          onClose()
        } catch (err) {
          console.error("Failed to delete template:", err)
          toast.error(`Failed to delete "${tpl.name}". Please try again.`) // error toast
        }
      },
    })
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={contestLoading || templatesLoading}
      error={contestError || templatesError}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
        {/* Add New Template Card */}
        <div
          onClick={() =>
            navigate(
              `/organizer/contests/${contestId}/certificates/templates/new`
            )
          }
          className="flex flex-col justify-center items-center rounded-[5px] border border-[#E5E5E5] bg-white cursor-pointer hover:bg-[#F6F6F6] hover:border-b-[#CCCCCC] transition"
        >
          <Plus size={32} className="mb-[10px]" />
          <span className="text-sm leading-5">Add template</span>
        </div>

        {/* Existing templates */}
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

      <TablePagination pagination={pagination} onPageChange={setPage} />
    </PageContainer>
  )
}

export default OrganizerCertificateTemplates
