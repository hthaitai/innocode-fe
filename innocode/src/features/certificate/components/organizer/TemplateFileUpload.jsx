import React, { useRef } from "react"
import { useTranslation } from "react-i18next"

export default function TemplateFileUpload({ formData, setFormData, errors }) {
  const { t } = useTranslation(["certificate"])
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
    <div>
      <label className="block text-xs leading-4 mb-2">
        {t("certificate:fileUpload.label")}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleFileButtonClick}
          className="button-orange"
        >
          {formData.file
            ? t("certificate:fileUpload.change")
            : t("certificate:fileUpload.choose")}
        </button>

        {formData.file && (
          <span className="text-sm leading-5 text-[#7A7574] truncate max-w-[200px]">
            {formData.file.name}
          </span>
        )}
        {!formData.file && formData.fileUrl && (
          <span className="text-sm leading-5 text-[#7A7574] truncate max-w-[200px]">
            {t("certificate:fileUpload.current")}
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
