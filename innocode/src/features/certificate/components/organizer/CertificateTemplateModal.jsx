import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import { useGetCertificateTemplatesQuery } from "@/services/certificateApi"
import { Check } from "lucide-react"
import { Spinner } from "@/shared/components/SpinnerFluent"

const CertificateTemplateModal = ({
  isOpen,
  onClose,
  contestId,
  onAward,
  awarding = false,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const {
    data: templateRes,
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

  const templates = templateRes?.data || []

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
      size="lg"
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

        <div className="flex flex-col gap-1">
          {!isLoading &&
            !isError &&
            templates.map((template) => {
              const isSelected =
                selectedTemplate?.templateId === template.templateId
              return (
                <div
                  key={template.templateId}
                  className={`flex justify-between items-center min-h-[70px] px-5 rounded-[5px] cursor-pointer transition-colors ${
                    isSelected ? "bg-[#F6F6F6] border border-orange-500" : "hover:bg-[#F6F6F6]"
                  }`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex gap-5 items-center">
                    {isSelected && (
                      <Check size={20} className="text-[#E05307]" />
                    )}
                    <div className="flex flex-col">
                      <span className={isSelected ? "font-medium" : ""}>
                        {template.name || template.templateName || `Template #${template.templateId}`}
                      </span>
                      {template.createdAt && (
                        <span className="text-xs leading-4 text-[#7A7574]">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </BaseModal>
  )
}

export default CertificateTemplateModal

