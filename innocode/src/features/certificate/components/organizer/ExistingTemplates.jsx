import React from "react"
import { useGetCertificateTemplatesQuery } from "../../../../services/certificateApi"

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {templates.map((tpl) => (
        <a
          key={tpl.templateId}
          href={tpl.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-[5px] border border-[#E5E5E5] bg-white transform transition-transform hover:-translate-y-1"
        >
          {/* Image container */}
          <div className="relative w-full h-48 overflow-hidden rounded-t-[5px]">
            {/* Template Image */}
            <img
              src={tpl.fileUrl}
              alt={tpl.name}
              className="w-full h-full object-cover"
            />

            {/* Full image gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>

            {/* Text at the bottom */}
            <h3 className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium line-clamp-2">
              {tpl.name}
            </h3>
          </div>
        </a>
      ))}
    </div>
  )
}
