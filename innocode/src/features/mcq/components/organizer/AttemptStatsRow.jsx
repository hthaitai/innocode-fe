import React from "react"

const AttemptStatsRow = ({ totalQuestions, correctAnswers, score }) => {
  const incorrect = totalQuestions - correctAnswers

  const stats = [
    { label: "Total Questions", value: totalQuestions, color: "" },
    { label: "Correct Answers", value: correctAnswers, color: "text-green-600" },
    { label: "Incorrect Answers", value: incorrect, color: "text-red-600" },
    { label: "Score", value: `${score}%`, color: "text-blue-600" },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="border border-[#E5E5E5] rounded-[5px] bg-white px-4 py-3 text-center"
        >
          <p className="text-sm text-[#7A7574]">{s.label}</p>
          <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  )
}

export default AttemptStatsRow
