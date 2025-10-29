import React from "react"
import { TextField } from "@mui/material"

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
      <TextField
        label="Template Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors.name}
        helperText={errors.name}
      />

      {/* File URL (you can later switch this to file upload input) */}
      <TextField
        label="Template File URL"
        name="file_url"
        placeholder="https://example.com/certificate-template.pdf"
        value={formData.file_url || ""}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors.file_url}
        helperText={errors.file_url}
      />
    </div>
  )
}
