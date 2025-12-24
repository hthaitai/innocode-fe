import Label from "@/shared/components/form/Label"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DateTimeFieldFluent from "@/shared/components/datetimefieldfluent/DateTimeFieldFluent"

export default function BasicInfoSection({
  formData,
  errors,
  onChange,
  isEditingRetakeRound,
}) {
  return (
    <>
      {!isEditingRetakeRound && (
        <>
          <Label required>Round name</Label>
          <TextFieldFluent
            name="name"
            value={formData.name || ""}
            onChange={onChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </>
      )}

      <Label required>Start</Label>
      <DateTimeFieldFluent
        name="start"
        type="datetime-local"
        value={formData.start || ""}
        onChange={onChange}
        error={!!errors.start}
        helperText={errors.start}
      />

      <Label required>End</Label>
      <DateTimeFieldFluent
        name="end"
        type="datetime-local"
        value={formData.end || ""}
        onChange={onChange}
        error={!!errors.end}
        helperText={errors.end}
      />

      {!isEditingRetakeRound && (
        <>
          <Label>Time limit (seconds)</Label>
          <TextFieldFluent
            name="timeLimitSeconds"
            type="number"
            value={formData.timeLimitSeconds ?? ""}
            onChange={onChange}
            error={!!errors.timeLimitSeconds}
            helperText={errors.timeLimitSeconds}
          />
        </>
      )}
    </>
  )
}
