import React from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"

const AttemptInfo = ({ attemptDetail }) => {
  const safe = (val) =>
    val === null || val === undefined || val === "" ? "—" : val

  return (
    <InfoSection title="Attempt Information">
      <DetailTable
        data={[
          { label: "Test Name", value: safe(attemptDetail.testName) },
          { label: "Student", value: safe(attemptDetail.studentName) },
          { label: "Submitted At", value: safe(formatDateTime(attemptDetail.submittedAt)) },
          { label: "Total Questions", value: safe(attemptDetail.totalQuestions) },
          { label: "Correct Answers", value: safe(attemptDetail.correctAnswers) },
          { label: "Score", value: safe(`${attemptDetail.score}%`) },
        ]}
      />
    </InfoSection>
  )
}

export default AttemptInfo
