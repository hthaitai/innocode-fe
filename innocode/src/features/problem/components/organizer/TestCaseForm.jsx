import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DropdownFluent from "@/shared/components/DropdownFluent"

const types = [
  { value: "public", label: "Public" },
  { value: "hidden", label: "Hidden" },
]

export default function TestCaseForm({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear field-specific error on change
    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelect = (value, field) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear dropdown error on select
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Description */}
      <TextFieldFluent
        label="Description"
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        error={!!errors?.description}
        helperText={errors?.description}
      />

      {/* Type */}
      <DropdownFluent
        label="Type"
        value={formData.type || "public"}
        placeholder="Select type"
        options={types}
        onChange={(value) => handleSelect(value, "type")}
      />
      {errors?.type && (
        <span className="text-red-500 text-xs">{errors.type}</span>
      )}

      {/* Weight */}
      <TextFieldFluent
        label="Weight"
        name="weight"
        type="number"
        value={formData.weight ?? 1}
        onChange={handleChange}
        error={!!errors?.weight}
        helperText={errors?.weight}
      />

      {/* Time Limit */}
      <TextFieldFluent
        label="Time Limit (ms)"
        name="time_limit_ms"
        type="number"
        value={formData.time_limit_ms ?? 1000}
        onChange={handleChange}
      />

      {/* Memory */}
      <TextFieldFluent
        label="Memory (KB)"
        name="memory_kb"
        type="number"
        value={formData.memory_kb ?? 65536}
        onChange={handleChange}
      />
    </div>
  )
}
