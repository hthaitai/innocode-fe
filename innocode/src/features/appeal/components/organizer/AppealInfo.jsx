import React from "react"
import { useTranslation } from "react-i18next"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import StatusBadge from "@/shared/components/StatusBadge"

const AppealInfo = ({ appeal }) => {
  console.log(appeal)
  const { t } = useTranslation(["appeal"])
  const safe = (val) =>
    val === null || val === undefined || val === "" ? "—" : val

  const data = [
    // Appeal specifics
    {
      label: t("appeal:status"),
      value: (
        <StatusBadge
          status={appeal.state}
          label={appeal.state ? t(`appeal:states.${appeal.state}`) : undefined}
        />
      ),
    },
    { label: t("appeal:student"), value: safe(appeal.ownerName) },
    { label: t("appeal:reason"), value: safe(appeal.reason) },
    { spacer: true },

    // Decision info
    { label: t("appeal:mentor"), value: safe(appeal.mentorName) },
    {
      label: t("appeal:decision"),
      value: appeal.decision ? t(`appeal:decisions.${appeal.decision}`) : "—",
    },
    {
      label: t("appeal:resolution"),
      value: appeal.appealResolution
        ? t(`appeal:resolutions.${appeal.appealResolution}`)
        : "—",
    },
    { spacer: true },

    // Identifiers / Context
    { label: t("appeal:team"), value: safe(appeal.teamName) },
    { label: t("appeal:contest"), value: safe(appeal.contestName) },
    { label: t("appeal:round"), value: safe(appeal.roundName) },
    {
      label: t("appeal:type"),
      value: appeal.targetType
        ? t(`appeal:targetTypes.${appeal.targetType}`)
        : "—",
    },
    { spacer: true },

    // Miscellaneous
    {
      label: t("appeal:createdAt"),
      value: safe(formatDateTime(appeal.createdAt)),
    },
    {
      label: t("appeal:evidences"),
      value: appeal.evidences?.length
        ? `${appeal.evidences.length} ${
            appeal.evidences.length > 1 ? t("appeal:files") : t("appeal:file")
          }`
        : "—",
    },
  ]

  return (
    <InfoSection title={t("appealInfo")}>
      <DetailTable data={data} labelWidth="154px" />
    </InfoSection>
  )
}

export default AppealInfo
