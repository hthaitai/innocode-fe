import React, { useCallback } from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useNavigate } from "react-router-dom"

const RoundInfo = ({ round }) => {
  const navigate = useNavigate()

  const handleEdit = useCallback(() => {
    if (!round) return
    // Navigate to dedicated edit page for this round
    navigate(`/organizer/contests/${round.contestId}/rounds/${round.roundId}/edit`)
  }, [round, navigate])

  if (!round) return null

  const safe = (val) =>
    val === null || val === undefined || val === "" ? "—" : val
  const formatPenaltyRate = (rate) =>
    rate == null || rate === "" ? "—" : `${(rate * 100).toFixed(0)}%`

  const details = []

  // Core Round Info
  details.push(
    { label: "Round Name", value: safe(round.roundName) },
    { label: "Contest Name", value: safe(round.contestName) },
    {
      label: "Problem Type",
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

  // Timing
  details.push(
    { label: "Start Time", value: safe(formatDateTime(round.start)) },
    { label: "End Time", value: safe(formatDateTime(round.end)) },
    { label: "Time Limit (seconds)", value: safe(round.timeLimitSeconds) },
    { spacer: true }
  )

  // MCQ Test Info
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
  }

  // Problem Info (AutoEval / Manual)
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
    details.push({ label: "Problem Configuration", value: "—" })
  }

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
