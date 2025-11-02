import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"

export default function RoundForm({
  formData,
  setFormData,
  errors = {},
  setErrors,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear the error when user modifies the field
    if (errors?.[name]) {
      setErrors?.((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <form className="flex flex-col gap-3">
      <TextFieldFluent
        label="Round Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
      />

      <TextFieldFluent
        label="Start"
        name="start"
        type="datetime-local"
        value={formData.start || ""}
        onChange={handleChange}
        error={!!errors.start}
        helperText={errors.start}
      />

      <TextFieldFluent
        label="End"
        name="end"
        type="datetime-local"
        value={formData.end || ""}
        onChange={handleChange}
        error={!!errors.end}
        helperText={errors.end}
      />
    </form>
  )
}
