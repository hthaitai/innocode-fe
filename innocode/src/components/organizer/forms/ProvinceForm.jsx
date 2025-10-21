import React from "react"
import { TextField } from "@mui/material"

export default function ProvinceForm({ formData, setFormData, errors }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex flex-col gap-4">
      <TextField
        label="Province Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        label="Address"
        name="address"
        value={formData.address || ""}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors.address}
        helperText={errors.address}
      />
    </div>
  )
}
