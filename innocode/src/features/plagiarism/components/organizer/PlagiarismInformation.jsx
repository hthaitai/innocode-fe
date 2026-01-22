import { useTranslation } from "react-i18next"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import { formatScore } from "@/shared/utils/formatNumber"

const PlagiarismInformation = ({ submission }) => {
  const { t } = useTranslation(["plagiarism"])
  if (!submission) return null

  return (
    <InfoSection title={t("plagiarismInfo")}>
      <DetailTable
        data={[
          { label: t("studentName"), value: submission.studentName },
          { label: t("teamName"), value: submission.teamName },
          { label: t("roundName"), value: submission.roundName },
          {
            label: t("submissionScore"),
            value:
              submission.score !== undefined && submission.score !== null
                ? `${formatScore(submission.score)} ${t("points")}`
                : "—",
          },
          {
            label: t("submittedAt"),
            value: formatDateTime(submission.submittedAt),
          },
        ]}
        labelWidth="133px"
      />
    </InfoSection>
  )
}

export default PlagiarismInformation
