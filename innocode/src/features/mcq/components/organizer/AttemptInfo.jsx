import React from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import { formatScore } from "../../../../shared/utils/formatNumber"

const AttemptInfo = ({ attemptDetail }) => {
  const safe = (val) =>
    val === null || val === undefined || val === "" ? "—" : val

  return (
    <InfoSection title="Attempt Information">
      <DetailTable
        data={[
          { label: "Test name", value: safe(attemptDetail.testName) },
          { label: "Student name", value: safe(attemptDetail.studentName) },
          {
            label: "Submitted at",
            value: safe(formatDateTime(attemptDetail.submittedAt)),
          },
          {
            label: "Total questions",
            value: safe(attemptDetail.totalQuestions),
          },
          {
            label: "Correct answers",
            value: safe(attemptDetail.correctAnswers),
          },
          { label: "Score", value: safe(formatScore(attemptDetail.score)) },
        ]}
      />
    </InfoSection>
  )
}

export default AttemptInfo
