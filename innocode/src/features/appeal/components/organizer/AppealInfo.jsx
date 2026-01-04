import React from "react"
import { useTranslation } from "react-i18next"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import StatusBadge from "@/shared/components/StatusBadge"

const AppealInfo = ({ appeal }) => {
  const { t } = useTranslation("pages")
  const safe = (val) =>
    val === null || val === undefined || val === "" ? "—" : val

  const data = [
    // Appeal specifics
    { label: t("appeal.status"), value: <StatusBadge status={appeal.state} /> },
    { label: t("appeal.studentName"), value: safe(appeal.ownerName) },
    { label: t("appeal.studentReason"), value: safe(appeal.reason) },
    { spacer: true },

    // Decision info
    { label: t("appeal.mentorName"), value: safe(appeal.mentorName) },
    { label: t("appeal.mentorDecision"), value: safe(appeal.decision) },
    { label: t("appeal.mentorReason"), value: safe(appeal.decisionReason) },
    {
      label: t("appeal.appealResolution"),
      value: safe(appeal.appealResolution),
    },
    { spacer: true },

    // Identifiers / Context
    { label: t("appeal.teamName"), value: safe(appeal.teamName) },
    { label: t("appeal.contestName"), value: safe(appeal.contestName) },
    { label: t("appeal.roundName"), value: safe(appeal.roundName) },
    { label: t("appeal.problemType"), value: safe(appeal.targetType) },
    { spacer: true },

    // Miscellaneous
    {
      label: t("appeal.created"),
      value: safe(formatDateTime(appeal.createdAt)),
    },
    {
      label: t("appeal.evidences"),
      value: appeal.evidences?.length
        ? `${appeal.evidences.length} ${
            appeal.evidences.length > 1 ? t("appeal.files") : t("appeal.file")
          }`
        : "—",
    },
  ]

  return (
    <InfoSection title={t("appeal.appealInformation")}>
      <DetailTable data={data} labelWidth="134px" />
    </InfoSection>
  )
}

export default AppealInfo
