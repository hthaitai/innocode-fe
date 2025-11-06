import React from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useNavigate } from "react-router-dom"

const RoundInfo = ({ round }) => {
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate(
      `/organizer/contests/${round.contestId}/rounds/${round.roundId}/edit`
    )
  }

  if (!round) return null

  const safe = (val) =>
    val === null || val === undefined || val === "" ? "—" : val

  const formatPenaltyRate = (rate) => {
    if (rate == null || rate === "") return "—"
    return `${(rate * 100).toFixed(0)}%`
  }

  const details = [
    { label: "Round Name", value: safe(round.roundName) },
    { label: "Contest Name", value: safe(round.contestName) },
    { label: "Start Time", value: safe(formatDateTime(round.start)) },
    { label: "End Time", value: safe(formatDateTime(round.end)) },
    {
      label: "Round Type",
      value:
        round.problemType === "McqTest"
          ? "Multiple Choice Questions (MCQ)"
          : round.problemType === "AutoEvaluation"
          ? "Auto Evaluation (Auto-graded Coding)"
          : round.problemType === "Manual"
          ? "Manual Evaluation (Judge Review)"
          : safe(round.problemType),
    },
  ]

  // 🧠 MCQ Test info
  if (round.mcqTest) {
    details.push({ label: "MCQ Test Name", value: safe(round.mcqTest.name) })

    try {
      const parsedConfig = JSON.parse(round.mcqTest.config || "{}")
      if (Object.keys(parsedConfig).length > 0) {
        Object.entries(parsedConfig).forEach(([key, value]) => {
          details.push({
            label: `Config – ${key.replace(/_/g, " ")}`,
            value:
              value === true
                ? "Yes"
                : value === false
                ? "No"
                : value?.toString?.() ?? "—",
          })
        })
      } else {
        details.push({ label: "MCQ Config", value: "—" })
      }
    } catch {
      details.push({
        label: "MCQ Config (Raw String)",
        value: safe(round.mcqTest.config),
      })
    }
  }

  // 💻 Problem info (AutoEval / Manual)
  if (round.problem) {
    details.push(
      { label: "Problem Language", value: safe(round.problem.language) },
      { label: "Penalty Rate", value: formatPenaltyRate(round.problem.penaltyRate) },
      { label: "Problem Description", value: safe(round.problem.description) }
    )
  } else if (!round.mcqTest) {
    // Only show this when neither exists
    details.push({ label: "Problem Configuration", value: "—" })
  }

  const filteredDetails = details.filter((d) => d.value !== undefined)

  return (
    <InfoSection
      title="Round Information"
      onEdit={handleEdit}
      children={<DetailTable data={filteredDetails} />}
    />
  )
}

export default RoundInfo
