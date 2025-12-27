import TextFieldFluent from "@/shared/components/TextFieldFluent"
import Label from "../../../../shared/components/form/Label"
import NameSuggestion from "./NameSuggestion"

const ContestDetailsSection = ({
  formData,
  errors,
  onChange,
  setFormData,
  setErrors,
}) => {
  return (
    <div className="space-y-5 border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5">
      {/* Contest Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" required>
          Contest name
        </Label>

        <div className="flex flex-col w-full">
          <TextFieldFluent
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={onChange}
            error={!!errors.name}
            helperText={errors.name}
          />

          <NameSuggestion
            suggestion={errors.nameSuggestion}
            onApply={() => {
              setFormData((prev) => ({ ...prev, name: errors.nameSuggestion }))
              setErrors((prev) => ({ ...prev, name: "", nameSuggestion: "" }))
            }}
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <TextFieldFluent
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={onChange}
          multiline
          rows={4}
          error={!!errors.description}
          helperText={errors.description}
        />
      </div>

      {/* Reward text */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="rewardsText">Rewards text</Label>
        <TextFieldFluent
          id="rewardsText"
          name="rewardsText"
          value={formData.rewardsText || ""}
          onChange={onChange}
          multiline
          rows={3}
          error={!!errors.rewardsText}
          helperText={errors.rewardsText}
        />
      </div>
    </div>
  )
}

export default ContestDetailsSection
