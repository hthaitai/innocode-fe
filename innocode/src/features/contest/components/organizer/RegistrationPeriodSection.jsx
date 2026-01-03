import DateTimeFieldFluent from "../../../../shared/components/datetimefieldfluent/DateTimeFieldFluent"
import Label from "../../../../shared/components/form/Label"
import { useTranslation } from "react-i18next"

const RegistrationPeriodSection = ({ formData, errors, onChange }) => {
  const { t } = useTranslation("pages")

  return (
    <div className="space-y-5 border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="registrationStart" required>
          {t("organizerContestForm.labels.registrationStart")}
        </Label>
        <DateTimeFieldFluent
          id="registrationStart"
          name="registrationStart"
          type="datetime-local"
          value={formData.registrationStart || ""}
          onChange={onChange}
          error={!!errors.registrationStart}
          helperText={errors.registrationStart}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="registrationEnd" required>
          {t("organizerContestForm.labels.registrationEnd")}
        </Label>
        <DateTimeFieldFluent
          id="registrationEnd"
          name="registrationEnd"
          type="datetime-local"
          value={formData.registrationEnd || ""}
          onChange={onChange}
          error={!!errors.registrationEnd}
          helperText={errors.registrationEnd}
        />
      </div>
    </div>
  )
}

export default RegistrationPeriodSection
