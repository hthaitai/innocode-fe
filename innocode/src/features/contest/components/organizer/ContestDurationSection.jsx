import DateTimeFieldFluent from "../../../../shared/components/datetimefieldfluent/DateTimeFieldFluent"
import Label from "../../../../shared/components/form/Label"

const ContestDurationSection = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-5 border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="start" required>
          Contest start date
        </Label>
        <DateTimeFieldFluent
          id="start"
          name="start"
          type="datetime-local"
          value={formData.start || ""}
          onChange={onChange}
          error={!!errors.start}
          helperText={errors.start}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="end" required>
          Contest end date
        </Label>
        <DateTimeFieldFluent
          id="end"
          name="end"
          type="datetime-local"
          value={formData.end || ""}
          onChange={onChange}
          error={!!errors.end}
          helperText={errors.end}
        />
      </div>
    </div>
  )
}

export default ContestDurationSection
