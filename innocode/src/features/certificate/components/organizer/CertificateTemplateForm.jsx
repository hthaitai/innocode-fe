import React from "react"
import TextFieldFluent from "../../../../shared/components/TextFieldFluent"

export default function CertificateTemplateForm({
  formData,
  setFormData,
  errors = {},
}) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Template Name */}
      <TextFieldFluent
        label="Template Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
      />

      {/* File URL */}
      <TextFieldFluent
        label="Template File URL"
        name="file_url"
        placeholder="https://example.com/certificate-template.pdf"
        value={formData.file_url || ""}
        onChange={handleChange}
        error={!!errors.file_url}
        helperText={errors.file_url}
      />
    </div>
  )
}
