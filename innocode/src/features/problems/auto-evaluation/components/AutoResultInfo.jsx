import React from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import StatusBadge from "@/shared/components/StatusBadge"
import { formatDateTime } from "@/shared/utils/dateTime"

const AutoResultInfo = ({ submission }) => {
  if (!submission) return null

  const submissionData = [
    {
      label: "Student name",
      value: submission.submittedByStudentName || "—",
    },
    { label: "Team name", value: submission.teamName || "—" },
    {
      label: "Status",
      value: <StatusBadge status={submission.status} />,
    },
    { label: "Score", value: submission.score ?? "—" },
    {
      label: "Attempts",
      value: submission.submissionAttemptNumber ?? "—",
    },
    {
      label: "Created at",
      value: submission.createdAt
        ? formatDateTime(submission.createdAt)
        : "—",
    },
  ]

  return (
    <InfoSection title="Submission information">
      <DetailTable data={submissionData} labelWidth="111px" />
    </InfoSection>
  )
}

export default AutoResultInfo

