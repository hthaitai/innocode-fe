import React from "react"
import { TextField } from "@mui/material"
import DropdownFluent from "@/shared/components/DropdownFluent"


const ContestForm = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelect = (value, name = "status") => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex flex-col gap-3">
      <TextField
        label="Year"
        name="year"
        type="number"
        value={formData.year || ""}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors.year}
        helperText={errors.year}
      />
      <TextField
        label="Contest Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        error={!!errors.description}
        helperText={errors.description}
      />
      <TextField
        label="Image URL"
        name="img_url"
        value={formData.img_url || ""}
        onChange={handleChange}
        fullWidth
        variant="outlined"
      />
      <DropdownFluent
        label="Status"
        value={formData.status || "draft"}
        onChange={handleSelect}
        placeholder="Select status"
        options={[
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
          { label: "Finalized", value: "finalized" },
        ]}
      />
    </div>
  )
}

export default ContestForm
