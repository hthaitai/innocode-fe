import React from "react"
import { TextField } from "@mui/material"
import DropdownFluent from "@/shared/components/DropdownFluent"

export default function TeamForm({
  formData,
  setFormData,
  errors = {},
  schools = [],
  mentors = [],
}) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelect = (value, field) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Team Name */}
      <TextField
        label="Team Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors.name}
        helperText={errors.name}
      />

      {/* School Dropdown */}
      <div className="flex flex-col">
        <DropdownFluent
          label="School"
          placeholder="Select a school"
          value={formData.school_id}
          options={schools.map((s) => ({
            value: s.school_id,
            label: s.name,
          }))}
          onChange={(value) => handleSelect(value, "school_id")}
        />
        {errors.school_id && (
          <span className="text-red-500 text-xs">{errors.school_id}</span>
        )}
      </div>

      {/* Mentor Dropdown */}
      <div className="flex flex-col">
        <DropdownFluent
          label="Mentor"
          placeholder="Select a mentor"
          value={formData.mentor_id}
          options={mentors.map((m) => ({
            value: m.mentor_id,
            label: m.user?.name || "Unknown",
          }))}
          onChange={(value) => handleSelect(value, "mentor_id")}
        />
        {errors.mentor_id && (
          <span className="text-red-500 text-xs">{errors.mentor_id}</span>
        )}
      </div>
    </div>
  )
}
