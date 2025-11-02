import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DropdownFluent from "@/shared/components/DropdownFluent"

const languages = [
  { value: "python3", label: "Python 3" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "javascript", label: "JavaScript" },
]

const types = [
  { value: "manual", label: "Manual" },
  { value: "auto", label: "Auto" },
]

export default function ProblemForm({
  formData,
  setFormData,
  errors = {},
  setErrors = () => {}, // ✅ allows parent (ProblemModal) to control error state
}) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined })) // ✅ clear error on input
  }

  const handleSelect = (value, field) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined })) // ✅ clear error on select
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Language */}
      <DropdownFluent
        label="Language"
        value={formData.language}
        placeholder="Select language"
        options={languages}
        onChange={(value) => handleSelect(value, "language")}
        error={!!errors.language}
        helperText={errors.language}
      />

      {/* Type */}
      <DropdownFluent
        label="Type"
        value={formData.type}
        placeholder="Select type"
        options={types}
        onChange={(value) => handleSelect(value, "type")}
        error={!!errors.type}
        helperText={errors.type}
      />

      {/* Penalty Rate */}
      <TextFieldFluent
        label="Penalty Rate"
        name="penalty_rate"
        type="number"
        value={formData.penalty_rate || ""}
        onChange={handleChange}
        error={!!errors.penalty_rate}
        helperText={errors.penalty_rate}
      />
    </div>
  )
}
