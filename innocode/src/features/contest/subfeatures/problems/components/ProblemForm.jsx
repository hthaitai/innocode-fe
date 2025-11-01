import React from "react"
import { TextField } from "@mui/material"
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

export default function ProblemForm({ formData, setFormData, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelect = (value, field) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Language */}
      <div className="flex flex-col">
        <DropdownFluent
          label="Language"
          value={formData.language}
          placeholder="Select language"
          options={languages}
          onChange={(value) => handleSelect(value, "language")}
        />
        {errors.language && (
          <span className="text-red-500 text-xs">{errors.language}</span>
        )}
      </div>

      {/* Type */}
      <div className="flex flex-col">
        <DropdownFluent
          label="Type"
          value={formData.type}
          placeholder="Select type"
          options={types}
          onChange={(value) => handleSelect(value, "type")}
        />
        {errors.type && (
          <span className="text-red-500 text-xs">{errors.type}</span>
        )}
      </div>

      {/* Penalty Rate */}
      <TextField
        label="Penalty Rate"
        name="penalty_rate"
        type="number"
        value={formData.penalty_rate || ""}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors.penalty_rate}
        helperText={errors.penalty_rate}
      />
    </div>
  )
}
