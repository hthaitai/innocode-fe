import React from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"

const ManualResultInfo = ({ submission }) => {
  if (!submission) return null

  const submissionData = [
    { label: "Student", value: submission.studentName || "—" },
    { label: "Team", value: submission.teamName || "—" },
    {
      label: "Submitted at",
      value: submission.submittedAt
        ? formatDateTime(submission.submittedAt)
        : "—",
    },
    { label: "Judged by", value: submission.judgedBy || "—" },
    {
      label: "Score",
      value:
        submission.totalScore !== undefined &&
        submission.maxPossibleScore !== undefined
          ? `${submission.totalScore} / ${submission.maxPossibleScore}`
          : "—",
    },
  ]

  return (
    <InfoSection title="Submission information">
      <DetailTable data={submissionData} labelWidth="106px" />
    </InfoSection>
  )
}

export default ManualResultInfo

