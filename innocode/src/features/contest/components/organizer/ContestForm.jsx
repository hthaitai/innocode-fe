import React from "react"
import ContestImageField from "./ContestImageField"
import ContestDetailsSection from "./ContestDetailsSection"
import RegistrationPeriodSection from "./RegistrationPeriodSection"
import ContestDurationSection from "./ContestDurationSection"
import ParticipationLimitsSection from "./ParticipationLimitsSection"
import ContestSettingsSection from "./ContestSettingsSection"
import { useTranslation } from "react-i18next"

const ContestForm = ({
  formData,
  setFormData,
  errors,
  setErrors,
  onSubmit,
  isSubmitting,
  mode = "create",
  hasChanges,
}) => {
  const { t } = useTranslation("pages")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const finalValue = type === "checkbox" ? checked : value
    setFormData((prev) => ({ ...prev, [name]: finalValue }))

    if (errors?.[name] && !errors.nameSuggestion) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const disabled = isSubmitting || (mode === "edit" && !hasChanges)

  return (
    <>
      <div className="space-y-1">
        <ContestImageField
          imgFile={formData.imgFile}
          imgUrl={formData.imgUrl}
          error={errors.imgFile}
          onChange={(file) =>
            setFormData((prev) => ({ ...prev, imgFile: file }))
          }
        />

        <ContestDetailsSection
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          onChange={handleChange}
        />
        <RegistrationPeriodSection
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />
        <ContestDurationSection
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />
        <ParticipationLimitsSection
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />
        <ContestSettingsSection
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />
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
              ? t("organizerContestForm.buttons.saving")
              : t("organizerContestForm.buttons.creating")
            : mode === "edit"
            ? t("organizerContestForm.buttons.save")
            : t("organizerContestForm.buttons.create")}
        </button>
      </div>
    </>
  )
}

export default ContestForm
