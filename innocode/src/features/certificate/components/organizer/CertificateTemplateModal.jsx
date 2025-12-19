import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import { useGetCertificateTemplatesQuery } from "@/services/certificateApi"
import { Check } from "lucide-react"
import { Spinner } from "@/shared/components/SpinnerFluent"
import TemplatePreviewCanvas from "./TemplatePreviewCanvas"
import TablePagination from "../../../../shared/components/TablePagination"

const CertificateTemplateModal = ({
  isOpen,
  onClose,
  contestId,
  onAward,
  awarding = false,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [page, setPage] = useState(1)
  const pageSize = 8

  const {
    data: templatesData,
    isLoading,
    isError,
  } = useGetCertificateTemplatesQuery(
    {
      contestIdSearch: contestId,
      pageNumber: 1,
      pageSize: 50,
    },
    { skip: !contestId || !isOpen }
  )

  const templates = templatesData?.data ?? []
  const pagination = templatesData?.additionalData

  useEffect(() => {
    if (!isOpen) {
      setSelectedTemplate(null)
    }
  }, [isOpen])

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
  }

  const handleAward = () => {
    if (selectedTemplate && onAward) {
      onAward(selectedTemplate)
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
      title="Choose a certificate template"
      size="full"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="button-white"
            onClick={handleClose}
            disabled={awarding}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button-orange"
            onClick={handleAward}
            disabled={!selectedTemplate || awarding}
          >
            {awarding ? "Awarding..." : "Award"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto text-sm leading-5">
        {isLoading && <Spinner />}

        {isError && (
          <p className="text-red-500 text-center">Failed to load templates</p>
        )}

        {!isLoading && !isError && templates.length === 0 && (
          <p className="text-center text-[#7A7574]">
            No templates available for this contest.
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
                      {template.name || "Untitled Template"}
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
