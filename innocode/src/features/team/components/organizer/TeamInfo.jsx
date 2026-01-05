import React from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useTranslation } from "react-i18next"

const TeamInfo = ({ team }) => {
  const { t } = useTranslation("common")

  const safe = (val, suffix = "") => {
    if (val === null || val === undefined || val === "") return "—"
    const text = typeof suffix === "function" ? suffix(val) : suffix
    return `${val}${text}`
  }

  const memberSuffix = (val) =>
    Number(val) === 1
      ? t("common.suffixes.member")
      : t("common.suffixes.members")

  return (
    <InfoSection title={t("teams.teamInfo")}>
      <DetailTable
        data={[
          {
            label: t("teams.teamName"),
            value: safe(team.name),
          },
          {
            label: t("organizerContests.table.name"),
            value: safe(team.contestName),
          },
          {
            label: t("schools.schoolName"),
            value: safe(team.schoolName),
          },
          {
            label: t("appeal.mentorName"),
            value: safe(team.mentorName),
          },
          {
            label: t("organizerContests.table.createdAt"),
            value: safe(formatDateTime(team.createdAt)),
          },
          {
            label: t("teams.memberCount"),
            value: safe(team.members?.length, memberSuffix),
          },
        ]}
      />
    </InfoSection>
  )
}

export default TeamInfo
