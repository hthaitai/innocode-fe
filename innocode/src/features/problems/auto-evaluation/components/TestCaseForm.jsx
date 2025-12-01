import React, { useEffect } from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"

// Reusable label component
const Label = ({ htmlFor, children, required }) => (
  <label className="pt-1" htmlFor={htmlFor}>
    {children} {required && <span className="text-red-500">*</span>}
  </label>
)

export default function TestCaseForm({
  mode = "create",
  formData,
  setFormData,
  errors = {},
  setErrors,
  onSubmit,
  isSubmitting = false,
  hasChanges = true,
}) {
  // Handle input changes
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

    // Clear error for this field immediately
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async () => {
    if (!onSubmit) return

    await onSubmit(formData, mode)
  }

  const disabled = !!isSubmitting || (mode === "edit" && !hasChanges)

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5 grid grid-cols-[max-content_1fr] gap-x-[28px] gap-y-5 items-start">
      {/* Description */}
      <Label htmlFor="description" required>
        Description
      </Label>
      <TextFieldFluent
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange("description")}
        multiline
        rows={3}
        error={!!errors.description}
        helperText={errors.description}
      />

      {/* Input */}
      <Label htmlFor="input" required>
        Input
      </Label>
      <TextFieldFluent
        id="input"
        name="input"
        value={formData.input}
        onChange={handleChange("input")}
        multiline
        rows={4}
        error={!!errors.input}
        helperText={errors.input}
      />

      {/* Expected Output */}
      <Label htmlFor="expectedOutput" required>
        Expected Output
      </Label>
      <TextFieldFluent
        id="expectedOutput"
        name="expectedOutput"
        value={formData.expectedOutput}
        onChange={handleChange("expectedOutput")}
        multiline
        rows={4}
        error={!!errors.expectedOutput}
        helperText={errors.expectedOutput}
      />

      {/* Weight */}
      <Label htmlFor="weight" required>
        Weight
      </Label>
      <TextFieldFluent
        id="weight"
        name="weight"
        type="number"
        min={0}
        value={formData.weight}
        onChange={handleChange("weight")}
        error={!!errors.weight}
        helperText={errors.weight}
      />

      {/* Time Limit */}
      <Label htmlFor="timeLimitMs">Time Limit (ms)</Label>
      <TextFieldFluent
        id="timeLimitMs"
        name="timeLimitMs"
        type="number"
        min={0}
        value={formData.timeLimitMs ?? ""}
        onChange={handleChange("timeLimitMs")}
      />

      {/* Memory */}
      <Label htmlFor="memoryKb">Memory (KB)</Label>
      <TextFieldFluent
        id="memoryKb"
        name="memoryKb"
        type="number"
        min={0}
        value={formData.memoryKb ?? ""}
        onChange={handleChange("memoryKb")}
      />

      {/* Submit Button */}
      <div></div>
      <div className="flex justify-start mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled}
          className={`flex items-center justify-center gap-2 ${
            disabled ? "button-gray" : "button-orange"
          }`}
        >
          {isSubmitting && (
            <span className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></span>
          )}

          {isSubmitting
            ? mode === "edit"
              ? "Saving..."
              : "Creating..."
            : mode === "edit"
            ? "Save"
            : "Create"}
        </button>
      </div>
    </div>
  )
}
