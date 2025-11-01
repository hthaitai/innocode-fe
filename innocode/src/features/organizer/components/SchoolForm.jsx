import React from "react"
import { TextField } from "@mui/material"
import DropdownFluent from "@/shared/components/DropdownFluent"

export default function SchoolForm({
  formData,
  setFormData,
  errors = {},
  provinces = [],
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
      {/* School Name */}
      <TextField
        label="School Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors.name}
        helperText={errors.name}
      />

      {/* Province Dropdown */}
      <div className="flex flex-col">
        <DropdownFluent
          label="Province"
          placeholder="Select a province"
          value={formData.province_id}
          options={provinces.map((p) => ({
            value: p.province_id,
            label: p.name,
          }))}
          onChange={(value) => handleSelect(value, "province_id")}
        />
        {errors.province_id && (
          <span className="text-red-500 text-xs">{errors.province_id}</span>
        )}
      </div>

      {/* Contact Email */}
      <TextField
        label="Contact Email"
        name="contact"
        value={formData.contact || ""}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors.contact}
        helperText={errors.contact}
      />
    </div>
  )
}
