import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"

export default function AutoTestCaseForm({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  const handleChange = (field) => (e) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "weight" || field === "timeLimitMs" || field === "memoryKb"
          ? value
            ? Number(value)
            : null
          : value,
    }))

    // Clear field-specific error on change
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Description */}
      <TextFieldFluent
        label="Description"
        multiline
        rows={3}
        value={formData.description ?? ""}
        placeholder="Description"
        onChange={handleChange("description")}
        error={!!errors?.description}
        helperText={errors?.description}
      />

      {/* Input / Expected Output */}
      <TextFieldFluent
        label="Input"
        multiline
        rows={4}
        value={formData.input ?? ""}
        placeholder="Input"
        onChange={handleChange("input")}
        error={!!errors?.input}
        helperText={errors?.input}
      />
      <TextFieldFluent
        label="Expected Output"
        multiline
        rows={4}
        value={formData.expectedOutput ?? ""}
        placeholder="Expected Output"
        onChange={handleChange("expectedOutput")}
        error={!!errors?.expectedOutput}
        helperText={errors?.expectedOutput}
      />

      {/* Weight + Time + Memory */}
      <TextFieldFluent
        label="Weight"
        type="number"
        min={0}
        value={formData.weight ?? 1}
        onChange={handleChange("weight")}
        error={!!errors?.weight}
        helperText={errors?.weight}
      />
      <TextFieldFluent
        label="Time Limit (ms)"
        type="number"
        min={0}
        placeholder="Time Limit (ms)"
        value={formData.timeLimitMs ?? ""}
        onChange={handleChange("timeLimitMs")}
      />
      <TextFieldFluent
        label="Memory (KB)"
        type="number"
        min={0}
        placeholder="Memory (KB)"
        value={formData.memoryKb ?? ""}
        onChange={handleChange("memoryKb")}
      />
    </div>
  )
}
