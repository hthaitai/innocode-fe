import React, { useRef } from "react"

export default function TemplateFileUpload({ formData, setFormData, errors }) {
  const fileInputRef = useRef(null)

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Store the local file for preview
    setFormData((prev) => ({ ...prev, file, fileUrl: null }))
  }

  return (
    <div className="border-b border-[#E5E5E5] pb-3">
      <label className="block text-xs leading-4 mb-2">Template file</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleFileButtonClick}
          className="button-orange"
        >
          {formData.file ? "Change" : "Choose File"}
        </button>

        {formData.file && (
          <span className="text-sm leading-5 text-[#7A7574] truncate max-w-[200px]">
            {formData.file.name}
          </span>
        )}
        {!formData.file && formData.fileUrl && (
          <span className="text-sm leading-5 text-[#7A7574] truncate max-w-[200px]">
            Current template
          </span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleFileChange}
      />

      {errors.file && (
        <p className="text-red-500 text-sm mt-1">{errors.file}</p>
      )}
    </div>
  )
}
