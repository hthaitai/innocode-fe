import React from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import { formatScore } from "../../../../shared/utils/formatNumber"
import { useTranslation } from "react-i18next"

const AttemptInfo = ({ attemptDetail }) => {
  console.log(attemptDetail)
  const { t } = useTranslation("common")

  const safe = (val, suffix = "") => {
    if (val === null || val === undefined || val === "") return "—"
    const text = typeof suffix === "function" ? suffix(val) : suffix
    return `${val}${text}`
  }

  const questionsSuffix = (val) =>
    Number(val) === 1
      ? t("common.suffixes.question")
      : t("common.suffixes.questions")

  const pointsSuffix = (val) => {
    // val is a formatted string, try to parse it
    const num = parseFloat(String(val).replace(/,/g, ""))
    return num === 1 ? t("common.suffixes.point") : t("common.suffixes.points")
  }

  return (
    <InfoSection title={t("common.attemptInformation")}>
      <DetailTable
        data={[
          {
            label: t("common.studentName"),
            value: safe(attemptDetail.studentName),
          },
          {
            label: t("common.submittedAt"),
            value: safe(formatDateTime(attemptDetail.submittedAt)),
          },
          {
            label: t("common.totalQuestions"),
            value: safe(attemptDetail.totalQuestions, questionsSuffix),
          },
          {
            label: t("common.correctAnswers"),
            value: safe(
              attemptDetail.correctAnswers,
              t("common.suffixes.correct")
            ),
          },
          {
            label: t("common.score"),
            value: safe(formatScore(attemptDetail.score), pointsSuffix),
          },
        ]}
        labelWidth="124px"
      />
    </InfoSection>
  )
}

export default AttemptInfo
