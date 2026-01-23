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
import { isFetchError } from "@/shared/utils/apiUtils"

const CertificateTemplateModal = ({
  isOpen,
  onClose,
  contestId,
  recipients = [],
}) => {
  const { t } = useTranslation(["leaderboard", "contest"])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [page, setPage] = useState(1)
  const [loadingAction, setLoadingAction] = useState(null)
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
    if (selectedTemplate?.templateId === template.templateId) {
      setSelectedTemplate(null)
    } else {
      setSelectedTemplate(template)
    }
  }

  const handleAward = async (isReissue = false) => {
    if (!selectedTemplate) {
      toast.error(t("leaderboard:modal.selectTemplate"))
      return
    }

    const payload = {
      templateId: selectedTemplate.templateId,
      recipients,
      output: "pdf",
      reissue: isReissue,
    }

    setLoadingAction(isReissue ? "reissue" : "award")
    try {
      await awardCertificates(payload).unwrap()
      toast.success(t("leaderboard:modal.success"))
      onClose()
      setSelectedTemplate(null)
    } catch (err) {
      console.error(err)

      if (isFetchError(err)) {
        toast.error(t("contest:suggestion.connectionError"))
        // we can return here but we need to stop loading action in finally block
        // the finally block handles that.
      } else if (err?.data?.errorCode === "DUPLICATE_CERTIFICATE") {
        toast.error(t("leaderboard:modal.certificateAlreadyExists"))
      } else {
        toast.error(
          err?.data?.message ||
            err?.data?.errorMessage ||
            t("leaderboard:modal.error"),
        )
      }
    } finally {
      setLoadingAction(null)
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
            disabled={!!loadingAction}
          >
            {t("leaderboard:modal.cancel")}
          </button>

          <button
            type="button"
            className={`${
              loadingAction === "reissue" ? "button-gray" : "button-white"
            } px-3 flex items-center justify-center gap-2`}
            onClick={() => handleAward(true)}
            disabled={!!loadingAction}
          >
            {loadingAction === "reissue" && (
              <div
                className={`w-4 h-4 border-2 ${
                  loadingAction === "reissue"
                    ? "border-white"
                    : "border-[#E05307]"
                } border-t-transparent rounded-full animate-spin`}
              />
            )}
            {loadingAction === "reissue"
              ? t("leaderboard:modal.reissuing")
              : t("leaderboard:modal.reissue")}
          </button>

          <button
            type="button"
            className={`${
              loadingAction === "award" ? "button-gray" : "button-orange"
            } px-3 flex items-center justify-center gap-2`}
            onClick={() => handleAward(false)}
            disabled={!!loadingAction}
          >
            {loadingAction === "award" && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loadingAction === "award"
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
