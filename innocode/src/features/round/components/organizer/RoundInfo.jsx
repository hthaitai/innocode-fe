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

  const details = []

  // 🏆 Core Round Info
  details.push(
    { label: "Round Name", value: safe(round.roundName) },
    { label: "Contest Name", value: safe(round.contestName) },
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
    { spacer: true }
  )

  // ⏰ Timing
  details.push(
    { label: "Start Time", value: safe(formatDateTime(round.start)) },
    { label: "End Time", value: safe(formatDateTime(round.end)) },
    { spacer: true }
  )

  // 🧠 MCQ Test info
  if (round.mcqTest) {
    details.push({ label: "MCQ Test Name", value: safe(round.mcqTest.name) })

    try {
      const parsedConfig = JSON.parse(round.mcqTest.config || "{}")
      if (Object.keys(parsedConfig).length > 0) {
        Object.entries(parsedConfig).forEach(([key, value]) => {
          details.push({
            label: `MCQ Config – ${key.replace(/_/g, " ")}`,
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

    // Spacer after MCQ config
  }

  // 💻 Problem info (AutoEval / Manual)
  if (round.problem) {
    details.push(
      { label: "Problem Language", value: safe(round.problem.language) },
      {
        label: "Penalty Rate",
        value: formatPenaltyRate(round.problem.penaltyRate),
      },
      { label: "Problem Description", value: safe(round.problem.description) }
    )
  } else if (!round.mcqTest) {
    // Add spacer separately from the row to ensure it renders
    details.push({ label: "Problem Configuration", value: "—" })
  }

  // Filter undefined values
  const filteredDetails = details.filter(
    (d) => d.value !== undefined || d.spacer
  )

  return (
    <InfoSection title="Round Information" onEdit={handleEdit}>
      <DetailTable data={filteredDetails} />
    </InfoSection>
  )
}

export default RoundInfo
