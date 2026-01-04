import React, { useEffect } from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import Label from "../../../../shared/components/form/Label"
import { useTranslation } from "react-i18next"

export default function TestCaseForm({
  mode = "create",
  formData,
  setFormData,
  errors,
  setErrors,
  onSubmit,
  isSubmitting,
  hasChanges,
}) {
  const { t } = useTranslation("common")

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

  const disabled = isSubmitting || (mode === "edit" && !hasChanges)

  return (
    <div className="space-y-1">
      {/* Description */}
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5 flex flex-col gap-2">
        <Label htmlFor="description" required>
          {t("common.description")}
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
      </div>

      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5 flex flex-col gap-2">
        {/* Input */}
        <Label htmlFor="input" required>
          {t("common.input")}
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
      </div>

      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5 flex flex-col gap-2">
        {/* Expected Output */}
        <Label htmlFor="expectedOutput" required>
          {t("common.expectedOutput")}
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
      </div>

      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5 flex flex-col gap-2">
        {/* Weight */}
        <Label htmlFor="weight" required>
          {t("common.weight")}
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
      </div>

      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5 space-y-5">
        <div className="flex flex-col gap-2">
          {/* Time Limit */}
          <Label htmlFor="timeLimitMs">{t("common.timeLimitMs")}</Label>
          <TextFieldFluent
            id="timeLimitMs"
            name="timeLimitMs"
            type="number"
            min={0}
            value={formData.timeLimitMs ?? ""}
            onChange={handleChange("timeLimitMs")}
          />
        </div>

        <div className="flex flex-col gap-2">
          {/* Memory */}
          <Label htmlFor="memoryKb">{t("common.memoryKb")}</Label>
          <TextFieldFluent
            id="memoryKb"
            name="memoryKb"
            type="number"
            min={0}
            value={formData.memoryKb ?? ""}
            onChange={handleChange("memoryKb")}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-start mt-3">
        <button
          type="button"
          onClick={onSubmit}
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
              ? t("common.saving")
              : t("common.creating")
            : mode === "edit"
            ? t("buttons.save")
            : t("buttons.create")}
        </button>
      </div>
    </div>
  )
}
