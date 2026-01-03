import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import TextFieldFluent from "@/shared/components/TextFieldFluent"

export default function ProvinceForm({
  formData,
  setFormData,
  errors,
  setErrors,
}) {
  const { t } = useTranslation("pages")
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear field-specific error when user types
    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }, [errors, setFormData, setErrors])

  return (
    <div className="flex flex-col gap-4">
      <TextFieldFluent
        label={t("provinces.provinceName")}
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        error={!!errors?.name}
        helperText={errors?.name}
      />

      <TextFieldFluent
        label={t("provinces.address")}
        name="address"
        value={formData.address || ""}
        onChange={handleChange}
        error={!!errors?.address}
        helperText={errors?.address}
      />
    </div>
  )
}
