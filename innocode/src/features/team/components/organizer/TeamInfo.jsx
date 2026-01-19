import React from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useTranslation } from "react-i18next"
import StatusBadge from "@/shared/components/StatusBadge"

const TeamInfo = ({ team }) => {
  const { t } = useTranslation("teams")

  const safe = (val, suffix = "") => {
    if (val === null || val === undefined || val === "") return "—"
    const text = typeof suffix === "function" ? suffix(val) : suffix
    return `${val}${text}`
  }

  const memberSuffix = (val) =>
    Number(val) === 1
      ? t("common:common.suffixes.member")
      : t("common:common.suffixes.members")

  return (
    <InfoSection title={t("teamInfo")}>
      <DetailTable
        data={[
          {
            label: t("teamName"),
            value: safe(team.name),
          },
          {
            label: t("table.status"),
            value: (
              <StatusBadge status={team.status || "Active"} translate="team" />
            ),
          },
          {
            label: t("common:organizerContests.table.name"),
            value: safe(team.contestName),
          },
          {
            label: t("common:schools.schoolName"),
            value: safe(team.schoolName),
          },
          {
            label: t("common:appeal.mentorName"),
            value: safe(team.mentorName),
          },
          {
            label: t("memberCount"),
            value: safe(team.members?.length, memberSuffix),
          },
          {
            label: t("common:organizerContests.table.createdAt"),
            value: safe(formatDateTime(team.createdAt)),
          },
        ]}
      />
    </InfoSection>
  )
}

export default TeamInfo
