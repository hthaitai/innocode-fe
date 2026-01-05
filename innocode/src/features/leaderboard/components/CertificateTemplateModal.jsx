import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import {
  useGetCertificateTemplatesQuery,
  useAwardCertificatesMutation,
} from "@/services/certificateApi"
import { Spinner } from "@/shared/components/SpinnerFluent"

import TablePagination from "@/shared/components/TablePagination"
import toast from "react-hot-toast"
import TemplatePreviewCanvas from "../../certificate/components/organizer/TemplatePreviewCanvas"
import { useTranslation } from "react-i18next"

const CertificateTemplateModal = ({
  isOpen,
  onClose,
  contestId,
  recipients = [],
}) => {
  const { t } = useTranslation(["leaderboard"])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [page, setPage] = useState(1)
  const [awarding, setAwarding] = useState(false)
  const pageSize = 8

  const [awardCertificates] = useAwardCertificatesMutation()

  const {
    data: templatesData,
    isLoading,
    isError,
  } = useGetCertificateTemplatesQuery({
    contestId,
    pageNumber: page,
    pageSize,
  })

  const templates = templatesData?.data ?? []
  const pagination = templatesData?.additionalData ?? {}

  useEffect(() => {
    if (!isOpen) {
      setSelectedTemplate(null)
    }
  }, [isOpen])

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
  }

  const handleAward = async () => {
    if (!selectedTemplate) return

    const payload = {
      templateId: selectedTemplate.templateId,
      recipients,
      output: "pdf",
      reissue: true,
    }

    setAwarding(true)
    try {
      await awardCertificates(payload).unwrap()
      toast.success(t("leaderboard:modal.success"))
      onClose()
      setSelectedTemplate(null)
    } catch (err) {
      console.error(err)
      toast.error(
        err?.data?.message ||
          err?.data?.errorMessage ||
          t("leaderboard:modal.error")
      )
    } finally {
      setAwarding(false)
    }
  }

  const handleClose = () => {
    setSelectedTemplate(null)
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("leaderboard:modal.title")}
      size="full"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="button-white"
            onClick={handleClose}
            disabled={awarding}
          >
            {t("leaderboard:modal.cancel")}
          </button>
          <button
            type="button"
            className={`${awarding ? "button-gray" : "button-orange"} px-3`}
            onClick={handleAward}
            disabled={!selectedTemplate || awarding}
          >
            {awarding
              ? t("leaderboard:modal.awarding")
              : t("leaderboard:modal.award")}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto text-sm leading-5">
        {isLoading && <Spinner />}

        {isError && (
          <p className="text-red-500 text-center">
            {t("leaderboard:modal.failedToLoadTemplates")}
          </p>
        )}

        {!isLoading && !isError && templates.length === 0 && (
          <p className="text-center text-[#7A7574]">
            {t("leaderboard:modal.noTemplates")}
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {!isLoading &&
            !isError &&
            templates.map((template) => {
              const isSelected =
                selectedTemplate?.templateId === template.templateId

              return (
                <div
                  key={template.templateId}
                  onClick={() => handleSelectTemplate(template)}
                  className={`relative cursor-pointer border border-[#E5E5E5] rounded-[5px] transition-all ${
                    isSelected ? "border-[#E2601A]" : ""
                  }`}
                >
                  <div className="relative w-full aspect-video overflow-hidden">
                    <TemplatePreviewCanvas template={template} />
                  </div>

                  <div className="p-3 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      size={20}
                      className="accent-[#E05307] rounded-[5px]"
                    />
                    <span className="text-sm leading-5 font-medium line-clamp-2">
                      {template.name || t("leaderboard:modal.untitled")}
                    </span>
                  </div>
                </div>
              )
            })}
        </div>

        <TablePagination pagination={pagination} onPageChange={setPage} />
      </div>
    </BaseModal>
  )
}

export default CertificateTemplateModal
