import React, { useCallback } from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useNavigate, useParams } from "react-router-dom"
import { useGetRoundByIdQuery } from "@/services/roundApi"

const RoundInfo = () => {
  const navigate = useNavigate()
  const { roundId } = useParams()
  const { data: round, isLoading, isError } = useGetRoundByIdQuery(roundId)

  const handleEdit = useCallback(() => {
    if (!round) return
    navigate(
      `/organizer/contests/${round.contestId}/rounds/${round.roundId}/edit`
    )
  }, [round, navigate])

  if (isLoading) return <div>Loading...</div>
  if (isError || !round) return <div>Failed to load round information.</div>

  const safe = (val) =>
    val === null || val === undefined || val === "" ? "—" : val
  const formatPenaltyRate = (rate) =>
    rate == null || rate === "" ? "—" : `${(rate * 100).toFixed(0)}%`

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
    { label: "Time limit (seconds)", value: safe(round.timeLimitSeconds) },
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
