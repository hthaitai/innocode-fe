import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"

const RubricForm = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear field-specific error when user types
    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <TextFieldFluent
        label="Description"
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        error={!!errors.description}
        helperText={errors.description}
      />

      <TextFieldFluent
        label="Max Score"
        name="maxScore"
        type="number"
        value={formData.maxScore || ""}
        onChange={handleChange}
        error={!!errors.maxScore}
        helperText={errors.maxScore}
      />
    </div>
  )
}

export default RubricForm
