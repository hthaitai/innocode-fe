import Label from "@/shared/components/form/Label"
import DropdownFluent from "@/shared/components/DropdownFluent"

export default function RoundTypeSection({
  formData,
  setFormData,
  rounds,
  errors,
  handleMainRoundSelect,
}) {
  return (
    <>
      <Label required>Round type</Label>
      <div className="flex gap-4 h-[32px]">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={!formData.isRetakeRound}
            onChange={() =>
              setFormData((prev) => ({
                ...prev,
                isRetakeRound: false,
                mainRoundId: "",
              }))
            }
          />
          Normal round
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={formData.isRetakeRound}
            onChange={() =>
              setFormData((prev) => ({
                ...prev,
                isRetakeRound: true,
              }))
            }
          />
          Retake round
        </label>
      </div>

      {formData.isRetakeRound && (
        <>
          <Label required>Round to retake</Label>
          <DropdownFluent
            options={rounds.map((r) => ({
              value: String(r.roundId),
              label: r.roundName,
            }))}
            value={String(formData.mainRoundId || "")}
            onChange={handleMainRoundSelect}
            placeholder="Select a round"
            error={!!errors.mainRoundId}
            helperText={errors.mainRoundId}
          />
        </>
      )}
    </>
  )
}
