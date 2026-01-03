import { useState } from "react"
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
  const [isRankCutoffEnabled, setIsRankCutoffEnabled] = useState(
    (formData.rankCutoff ?? 0) > 0
  )

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

      {!isEditingRetakeRound && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enable-rank-cutoff"
              checked={
                formData.rankCutoff > 0 || (isRankCutoffEnabled ?? false)
              }
              onChange={(e) => {
                const checked = e.target.checked
                setIsRankCutoffEnabled(checked)
                if (!checked) {
                  onChange({ target: { name: "rankCutoff", value: 0 } })
                }
              }}
              className="h-4 w-4 rounded border-gray-300 text-[#E05307] focus:ring-[#E05307]"
            />
            <Label htmlFor="enable-rank-cutoff">Teams advancing</Label>
          </div>

          {(formData.rankCutoff > 0 || isRankCutoffEnabled) && (
            <TextFieldFluent
              name="rankCutoff"
              type="number"
              min={0}
              value={formData.rankCutoff ?? 0}
              onChange={onChange}
              error={!!errors.rankCutoff}
              helperText={errors.rankCutoff}
            />
          )}
        </div>
      )}
    </div>
  )
}
