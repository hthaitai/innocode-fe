import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"

const PlagiarismInformation = ({ submission }) => {
  if (!submission) return null

  return (
    <InfoSection title="Plagiarism information">
      <DetailTable
        data={[
          { label: "Student name", value: submission.studentName },
          { label: "Team name", value: submission.teamName },
          { label: "Contest name", value: submission.contestName },
          { label: "Round name", value: submission.roundName },
          { label: "Submission score", value: submission.score },
          {
            label: "Submitted at",
            value: formatDateTime(submission.submittedAt),
          },
        ]}
        labelWidth="133px"
      />
    </InfoSection>
  )
}

export default PlagiarismInformation
