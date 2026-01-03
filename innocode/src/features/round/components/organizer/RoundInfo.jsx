import React, { useCallback } from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useNavigate } from "react-router-dom"

const RoundInfo = ({ round }) => {
  const navigate = useNavigate()

  const handleEdit = useCallback(() => {
    if (!round) return
    navigate(
      `/organizer/contests/${round.contestId}/rounds/${round.roundId}/edit`
    )
  }, [round, navigate])

  const safe = (val, suffix = "") => {
    if (val === null || val === undefined || val === "") return "—"
    const text = typeof suffix === "function" ? suffix(val) : suffix
    return `${val}${text}`
  }

  const formatPenaltyRate = (rate) =>
    rate == null || rate === "" ? "—" : `${(rate * 100).toFixed(0)}%`

  const secondsSuffix = (val) => (Number(val) === 1 ? " second" : " seconds")
  const teamsSuffix = (val) => (Number(val) === 1 ? " team" : " teams")

  const details = []

  // Core Round Info
  details.push(
    { label: "Round name", value: safe(round.roundName) },
    { label: "Contest name", value: safe(round.contestName) },
    {
      label: "Problem type",
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
    { label: "Start date", value: safe(formatDateTime(round.start)) },
    { label: "End date", value: safe(formatDateTime(round.end)) },
    { label: "Time limit", value: safe(round.timeLimitSeconds, secondsSuffix) },
    { label: "Teams advancing", value: safe(round.rankCutoff, teamsSuffix) },
    { spacer: true }
  )

  // MCQ Test Info (simplified, remove config)
  if (round.mcqTest) {
    details.push({ label: "MCQ test name", value: safe(round.mcqTest.name) })
  }

  if (round.problem) {
    details.push(
      { label: "Problem language", value: safe(round.problem.language) },
      {
        label: "Penalty rate",
        value: formatPenaltyRate(round.problem.penaltyRate),
      },
      { label: "Problem description", value: safe(round.problem.description) }
    )

    if (round.problemType === "AutoEvaluation") {
      details.push({
        label: "Test type",
        value:
          round.problem.testType === "MockTest"
            ? "Mock Test"
            : round.problem.testType === "InputOutput"
            ? "Input/Output"
            : "Input/Output", // default
      })
    }
  } else if (!round.mcqTest) {
    details.push({ label: "Problem configuration", value: "—" })
  }

  const filteredDetails = details.filter(
    (d) => d.value !== undefined || d.spacer
  )

  return (
    <InfoSection title="Round information" onEdit={handleEdit}>
      <DetailTable data={filteredDetails} labelWidth="180px" />
    </InfoSection>
  )
}

export default RoundInfo
