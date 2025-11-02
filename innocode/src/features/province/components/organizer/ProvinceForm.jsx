import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"

export default function ProvinceForm({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear field-specific error when user types
    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <TextFieldFluent
        label="Province Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        error={!!errors?.name}
        helperText={errors?.name}
      />

      <TextFieldFluent
        label="Address"
        name="address"
        value={formData.address || ""}
        onChange={handleChange}
        error={!!errors?.address}
        helperText={errors?.address}
      />
    </div>
  )
}
