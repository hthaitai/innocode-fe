import React, { useState } from "react"
import BaseModal from "@/shared/components/BaseModal"
import { useGetCertificateTemplatesQuery } from "../../../services/certificateApi"

export default function TemplateModal({
  isOpen,
  onClose,
  contestId,
  onSelectTemplate,
}) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)

  // Fetch templates
  const { data, isLoading, error } = useGetCertificateTemplatesQuery({
    contestIdSearch: contestId || "",
    pageNumber: 1,
    pageSize: 50,
  })

  const templates = data?.data || []

  const handleSelect = () => {
    if (!selectedTemplateId) return
    onSelectTemplate(selectedTemplateId)
    onClose()
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <button type="button" className="button-white" onClick={onClose}>
        Cancel
      </button>
      <button
        type="button"
        className={`button-orange ${
          !selectedTemplateId ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleSelect}
        disabled={!selectedTemplateId}
      >
        Select Template
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Certificate Template"
      size="full"
      footer={footer}
    >
      {isLoading && <p>Loading templates...</p>}
      {error && <p className="text-red-500">Failed to load templates.</p>}
      {!isLoading && templates.length === 0 && (
        <p>No templates uploaded yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
        {templates.map((tpl) => {
          const isSelected = tpl.templateId === selectedTemplateId
          return (
            <div
              key={tpl.templateId}
              className={`relative overflow-hidden rounded-[5px] border bg-white transform transition-transform cursor-pointer hover:-translate-y-1
                ${
                  isSelected
                    ? "border-orange-500 ring-2 ring-orange-200"
                    : "border-[#E5E5E5]"
                }`}
              onClick={() => setSelectedTemplateId(tpl.templateId)}
            >
              <div className="relative w-full h-48 overflow-hidden rounded-t-[5px]">
                <img
                  src={tpl.fileUrl}
                  alt={tpl.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                <h3 className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium line-clamp-2">
                  {tpl.name}
                </h3>
              </div>
            </div>
          )
        })}
      </div>
    </BaseModal>
  )
}
