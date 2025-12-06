import React, { useMemo } from "react"

export default function TemplatePreview({ formData }) {
  // Compute preview URL
  const previewUrl = useMemo(() => {
    if (formData.uploading) return null
    if (formData.fileUrl) return formData.fileUrl
    if (!formData.file) return null
    if (formData.file.type === "application/pdf") return "/pdf-placeholder.png"
    return URL.createObjectURL(formData.file)
  }, [formData.file, formData.fileUrl, formData.uploading])

  const getTextStyle = () => {
    if (!formData.text) return {}

    const { x, y, fontSize, fontFamily, colorHex, maxWidth, align } =
      formData.text

    return {
      position: "absolute",
      left: x,
      top: y,
      fontSize,
      fontFamily,
      color: colorHex,
      maxWidth: maxWidth ? maxWidth + "px" : "auto",
      textAlign: align,
      display: "inline-block",
      pointerEvents: "none",
      wordWrap: "break-word",
    }
  }

  return (
    <div className="relative w-full aspect-[16/9] border border-gray-300 rounded overflow-hidden bg-gray-50 flex items-center justify-center">
      {formData.uploading ? (
        <span>Uploading...</span>
      ) : previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt="Template Preview"
            className="w-full h-full object-cover"
          />
          {formData.text && (
            <span style={getTextStyle()}>
              {/* Placeholder text for the overlay */}
              Nguyen Van A
            </span>
          )}
        </>
      ) : (
        <span className="text-gray-400">Template preview will appear here</span>
      )}
    </div>
  )
}
