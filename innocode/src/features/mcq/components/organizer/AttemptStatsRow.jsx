import React from "react"
import { formatScore } from "../../../../shared/utils/formatNumber"

const AttemptStatsRow = ({ totalQuestions, correctAnswers, score }) => {
  const incorrect = totalQuestions - correctAnswers

  const stats = [
    { label: "Total Questions", value: totalQuestions, color: "" },
    {
      label: "Correct Answers",
      value: correctAnswers,
      color: "text-green-600",
    },
    { label: "Incorrect Answers", value: incorrect, color: "text-red-600" },
    { label: "Score", value: formatScore(score), color: "text-[#E05307]" },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
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
