import Label from "@/shared/components/form/Label"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DateTimeFieldFluent from "@/shared/components/datetimefieldfluent/DateTimeFieldFluent"

export default function BasicInfoSection({
  formData,
  errors,
  onChange,
  isEditingRetakeRound,
  isRetakeRound,
}) {
  return (
    <div className="space-y-5 border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5">
      {!isRetakeRound && (
        <div className="flex flex-col gap-2">
          <Label required>Round name</Label>
          <TextFieldFluent
            name="name"
            value={formData.name || ""}
            onChange={onChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label required>Start date</Label>
        <DateTimeFieldFluent
          name="start"
          type="datetime-local"
          value={formData.start || ""}
          onChange={onChange}
          error={!!errors.start}
          helperText={errors.start}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label required>End date</Label>
        <DateTimeFieldFluent
          name="end"
          type="datetime-local"
          value={formData.end || ""}
          onChange={onChange}
          error={!!errors.end}
          helperText={errors.end}
        />
      </div>

      {!isEditingRetakeRound && (
        <div className="flex flex-col gap-2">
          <Label>Time limit (seconds)</Label>
          <TextFieldFluent
            name="timeLimitSeconds"
            type="number"
            value={formData.timeLimitSeconds ?? ""}
            onChange={onChange}
            error={!!errors.timeLimitSeconds}
            helperText={errors.timeLimitSeconds}
          />
        </div>
      )}
    </div>
  )
}
