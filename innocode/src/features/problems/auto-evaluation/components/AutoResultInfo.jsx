import React from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import StatusBadge from "@/shared/components/StatusBadge"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useTranslation } from "react-i18next"

const AutoResultInfo = ({ submission }) => {
  const { t } = useTranslation("common")

  if (!submission) return null

  const safe = (val, suffix = "") => {
    if (val === null || val === undefined || val === "") return "—"
    const text = typeof suffix === "function" ? suffix(val) : suffix
    return `${val}${text}`
  }

  const attemptsSuffix = (val) =>
    Number(val) === 1
      ? t("common.suffixes.attempt")
      : t("common.suffixes.attempts")

  const submissionData = [
    {
      label: t("common.studentName"),
      value: submission.submittedByStudentName || "—",
    },
    { label: t("team.teamName"), value: submission.teamName || "—" },
    {
      label: t("common.status"),
      value: <StatusBadge status={submission.status} />,
    },
    { label: t("common.score"), value: submission.score ?? "—" },
    {
      label: t("common.attempts"),
      value: safe(submission.submissionAttemptNumber, attemptsSuffix),
    },
    {
      label: t("common.createdAt"),
      value: submission.createdAt ? formatDateTime(submission.createdAt) : "—",
    },
  ]

  return (
    <InfoSection title={t("common.submissionInformation")}>
      <DetailTable data={submissionData} labelWidth="111px" />
    </InfoSection>
  )
}

export default AutoResultInfo
