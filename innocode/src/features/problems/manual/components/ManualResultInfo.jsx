import React from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useTranslation } from "react-i18next"

const ManualResultInfo = ({ submission }) => {
  const { t } = useTranslation("common")
  if (!submission) return null

  const submissionData = [
    { label: t("common.student"), value: submission.studentName || "—" },
    { label: t("common.team"), value: submission.teamName || "—" },
    {
      label: t("common.submittedAt"),
      value: submission.submittedAt
        ? formatDateTime(submission.submittedAt)
        : "—",
    },
    { label: t("common.judgedBy"), value: submission.judgedBy || "—" },
    {
      label: t("common.score"),
      value:
        submission.totalScore !== undefined &&
        submission.maxPossibleScore !== undefined
          ? `${submission.totalScore} / ${submission.maxPossibleScore}`
          : "—",
    },
  ]

  return (
    <InfoSection title={t("common.submissionInformation")}>
      <DetailTable data={submissionData} labelWidth="106px" />
    </InfoSection>
  )
}

export default ManualResultInfo
