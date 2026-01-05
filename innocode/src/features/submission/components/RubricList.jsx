import { Loader2 } from "lucide-react"
import RubricItem from "./RubricItem"
import { useTranslation } from "react-i18next"

export default function RubricList({
  rubric,
  scores,
  evaluating,
  onScoreChange,
  onSubmit,
  errors,
  readOnly = false,
}) {
  const { t } = useTranslation("judge")

  return (
    <div>
      <div className="text-sm font-semibold pt-3 pb-2">
        {t("evaluation.rubric.title")}
      </div>

      {!rubric?.length ? (
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          {t("evaluation.rubric.noRubric")}
        </div>
      ) : (
        <div className="space-y-1">
          {rubric.map((c, idx) => (
            <RubricItem
              key={c.rubricId}
              index={idx}
              item={c}
              scoreObj={scores.find((s) => s.rubricId === c.rubricId)}
              onChange={onScoreChange}
              error={errors[c.rubricId]}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}

      {!readOnly && (
        <div className="mt-5">
          <button
            type="button"
            onClick={onSubmit}
            disabled={evaluating || !rubric?.length}
            className={`flex items-center gap-2 justify-center ${
              evaluating ? "button-gray" : "button-orange"
            }`}
          >
            {evaluating && <Loader2 className="animate-spin w-4 h-4" />}
            {evaluating
              ? t("evaluation.rubric.submitting")
              : t("evaluation.rubric.submit")}
          </button>
        </div>
      )}
    </div>
  )
}
