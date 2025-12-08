import React from "react"
import { useGetCertificateTemplatesQuery } from "../../../../services/certificateApi"
import TemplatePreviewCanvas from "./TemplatePreviewCanvas"

export default function ExistingTemplates({ contestId }) {
  const { data, isLoading, error } = useGetCertificateTemplatesQuery({
    contestIdSearch: contestId || "",
    pageNumber: 1,
    pageSize: 50,
  })

  const templates = data?.data || []

  if (isLoading) return <p>Loading templates...</p>
  if (error) return <p className="text-red-500">Failed to load templates.</p>
  if (templates.length === 0) return <p>No templates uploaded yet.</p>

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {templates.map((tpl) => (
        <a
          key={tpl.templateId}
          href={tpl.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg border border-[#E5E5E5] bg-white hover:shadow-md transition-shadow"
        >
          {/* Image container — locked to 16:9 */}
          <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
            <TemplatePreviewCanvas template={tpl} />
          </div>

          {/* Name below */}
          <div className="p-3">
            <h3 className="text-sm leading-5 font-medium line-clamp-2">
              {tpl.name}
            </h3>
          </div>
        </a>
      ))}
    </div>
  )
}
