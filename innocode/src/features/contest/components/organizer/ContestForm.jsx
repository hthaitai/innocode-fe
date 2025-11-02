import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DropdownFluent from "@/shared/components/DropdownFluent"

const ContestForm = ({ formData, setFormData, errors, setErrors  }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear field-specific error when user types
    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelect = (value, name = "status") => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear dropdown error when user selects an option
    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <TextFieldFluent
        label="Year"
        name="year"
        type="number"
        value={formData.year || ""}
        onChange={handleChange}
        error={!!errors.year}
        helperText={errors.year}
      />
      <TextFieldFluent
        label="Contest Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextFieldFluent
        label="Description"
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        multiline
        rows={4}
        error={!!errors.description}
        helperText={errors.description}
      />
      <TextFieldFluent
        label="Image URL"
        name="img_url"
        value={formData.img_url || ""}
        onChange={handleChange}
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
