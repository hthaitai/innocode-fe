import Label from "@/shared/components/form/Label"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation("round")
  return (
    <div>
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5 flex flex-col gap-2">
        <Label required>{t("form.roundType")}</Label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={!formData.isRetakeRound}
            onChange={() => setFormData(EMPTY_ROUND)}
          />
          {t("form.normalRound")}
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
          {t("form.retakeRound")}
        </label>
      </div>

      <div className="mt-1">
        {formData.isRetakeRound && (
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5 flex flex-col gap-2">
            <Label required>{t("form.roundToRetake")}</Label>

            <div className="min-w-[130px] w-max">
              <DropdownFluent
                options={rounds.map((r) => ({
                  value: String(r.roundId),
                  label: r.roundName,
                }))}
                value={String(formData.mainRoundId || "")}
                onChange={handleMainRoundSelect}
                placeholder={t("form.selectRoundPlaceholder")}
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
