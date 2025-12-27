import Label from "@/shared/components/form/Label"
import DropdownFluent from "@/shared/components/DropdownFluent"
import { EMPTY_ROUND } from "../../constants/roundConstants"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { AnimatePresence } from "framer-motion"

export default function RoundTypeSection({
  formData,
  setFormData,
  rounds,
  errors,
  handleMainRoundSelect,
}) {
  return (
    <div>
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5 flex flex-col gap-2">
        <Label required>Round type</Label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={!formData.isRetakeRound}
            onChange={() => setFormData(EMPTY_ROUND)}
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

      <div className="mt-1">
        {formData.isRetakeRound && (
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5 flex flex-col gap-2">
            <Label required>Round to retake</Label>

            <div className="max-w-fit">
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
