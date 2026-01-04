import React from "react"
import { formatScore } from "../../../../shared/utils/formatNumber"
import { useTranslation } from "react-i18next"

const AttemptStatsRow = ({
  totalQuestions,
  correctAnswers,
  score,
  totalPossibleScore,
}) => {
  const { t } = useTranslation("common")
  const incorrect = totalQuestions - correctAnswers

  const stats = [
    { label: t("common.totalQuestions"), value: totalQuestions, color: "" },
    {
      label: t("common.correctAnswers"),
      value: correctAnswers,
      color: "text-green-600",
    },
    {
      label: t("common.incorrectAnswers"),
      value: incorrect,
      color: "text-red-600",
    },
    {
      label: t("common.score"),
      value: formatScore(score),
      color: "text-[#E05307]",
    },
    {
      label: t("common.maxScore"),
      value: formatScore(totalPossibleScore),
      color: "text-[#E05307]",
    },
  ]

  return (
    <div className="grid grid-cols-5 gap-3">
      {stats.map((s, i) => (
        <div
          key={i}
          className="relative w-full bg-white border border-[#E5E5E5] rounded-[5px] overflow-hidden"
          style={{ paddingTop: "56.25%" }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-3 text-center">
            <p className="text-sm text-[#7A7574]">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AttemptStatsRow
