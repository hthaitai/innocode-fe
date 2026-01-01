import TextFieldFluent from "@/shared/components/TextFieldFluent"
import Label from "../../../../shared/components/form/Label"

const ParticipationLimitsSection = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-5 border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="teamMembersMin" required>
          Min team members
        </Label>
        <TextFieldFluent
          id="teamMembersMin"
          name="teamMembersMin"
          type="number"
          value={formData.teamMembersMin || ""}
          onChange={onChange}
          error={!!errors.teamMembersMin}
          helperText={errors.teamMembersMin}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="teamMembersMax" required>
          Max team members
        </Label>
        <TextFieldFluent
          id="teamMembersMax"
          name="teamMembersMax"
          type="number"
          value={formData.teamMembersMax || ""}
          onChange={onChange}
          error={!!errors.teamMembersMax}
          helperText={errors.teamMembersMax}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="teamLimitMax" required>
          Max teams
        </Label>
        <TextFieldFluent
          id="teamLimitMax"
          name="teamLimitMax"
          type="number"
          value={formData.teamLimitMax || ""}
          onChange={onChange}
          error={!!errors.teamLimitMax}
          helperText={errors.teamLimitMax}
        />
      </div>
    </div>
  )
}

export default ParticipationLimitsSection
