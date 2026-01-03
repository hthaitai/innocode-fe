import TextFieldFluent from "@/shared/components/TextFieldFluent"
import Label from "../../../../shared/components/form/Label"

const ContestSettingsSection = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-5 border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="appealSubmitDays" required>
          Appeal submission deadline (days)
        </Label>
        <TextFieldFluent
          id="appealSubmitDays"
          name="appealSubmitDays"
          type="number"
          value={formData.appealSubmitDays || ""}
          onChange={onChange}
          error={!!errors.appealSubmitDays}
          helperText={errors.appealSubmitDays}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="appealReviewDays" required>
          Appeal review deadline (days)
        </Label>
        <TextFieldFluent
          id="appealReviewDays"
          name="appealReviewDays"
          type="number"
          value={formData.appealReviewDays || ""}
          onChange={onChange}
          error={!!errors.appealReviewDays}
          helperText={errors.appealReviewDays}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="judgeRescoreDays" required>
          Judge rescore deadline (days)
        </Label>
        <TextFieldFluent
          id="judgeRescoreDays"
          name="judgeRescoreDays"
          type="number"
          value={formData.judgeRescoreDays || ""}
          onChange={onChange}
          error={!!errors.judgeRescoreDays}
          helperText={errors.judgeRescoreDays}
        />
      </div>
    </div>
  )
}

export default ContestSettingsSection
