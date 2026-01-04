import React, { useCallback } from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const RoundInfo = ({ round }) => {
  const navigate = useNavigate()
  const { t } = useTranslation("round")

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

  const secondsSuffix = (val) =>
    Number(val) === 1 ? t("info.suffixes.second") : t("info.suffixes.seconds")
  const teamsSuffix = (val) =>
    Number(val) === 1 ? t("info.suffixes.team") : t("info.suffixes.teams")

  const details = []

  // Core Round Info
  details.push(
    { label: t("info.roundName"), value: safe(round.roundName) },
    { label: t("info.contestName"), value: safe(round.contestName) },
    {
      label: t("info.problemType"),
      value:
        round.problemType === "McqTest"
          ? t("info.values.mcq")
          : round.problemType === "AutoEvaluation"
          ? t("info.values.auto")
          : round.problemType === "Manual"
          ? t("info.values.manual")
          : safe(round.problemType),
    },
    { spacer: true }
  )

  // Timing
  details.push(
    { label: t("info.startDate"), value: safe(formatDateTime(round.start)) },
    { label: t("info.endDate"), value: safe(formatDateTime(round.end)) },
    {
      label: t("info.timeLimit"),
      value: safe(round.timeLimitSeconds, secondsSuffix),
    },
    {
      label: t("info.teamsAdvancing"),
      value: safe(round.rankCutoff, teamsSuffix),
    }
  )

  if (round.problem) {
    details.push(
      { spacer: true },
      { label: t("info.problemLanguage"), value: safe(round.problem.language) },
      {
        label: t("info.penaltyRate"),
        value: formatPenaltyRate(round.problem.penaltyRate),
      },
      {
        label: t("info.problemDescription"),
        value: safe(round.problem.description),
      }
    )

    if (round.problemType === "AutoEvaluation") {
      details.push({
        label: t("info.testType"),
        value:
          round.problem.testType === "MockTest"
            ? t("info.values.mockTest")
            : round.problem.testType === "InputOutput"
            ? t("info.values.inputOutput")
            : t("info.values.inputOutput"), // default
      })
    }
  } else if (!round.mcqTest) {
    details.push({ label: t("info.problemConfig"), value: "—" })
  }

  const filteredDetails = details.filter(
    (d) => d.value !== undefined || d.spacer
  )

  return (
    <InfoSection title={t("info.title")} onEdit={handleEdit}>
      <DetailTable data={filteredDetails} labelWidth="180px" />
    </InfoSection>
  )
}

export default RoundInfo
