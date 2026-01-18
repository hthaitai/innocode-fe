import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "../../../../shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import StatusBadge from "../../../../shared/components/StatusBadge"
import { useTranslation } from "react-i18next"

const ContestInfo = ({ contest }) => {
  const navigate = useNavigate()
  const { t } = useTranslation(["pages", "contest"])

  const safe = (val, suffix = "") => {
    if (val === null || val === undefined || val === "") return "—"
    const text = typeof suffix === "function" ? suffix(val) : suffix
    return `${val}${text}`
  }

  const daysSuffix = (val) =>
    Number(val) === 1
      ? t("contest:info.labels.day")
      : t("contest:info.labels.days")

  const membersSuffix = (val) =>
    Number(val) === 1
      ? t("contest:info.labels.member")
      : t("contest:info.labels.members")

  const teamsSuffix = (val) =>
    Number(val) === 1
      ? t("contest:info.labels.team")
      : t("contest:info.labels.teams")

  // Move edit logic here
  const handleEdit = () => {
    if (!contest) return
    navigate(`/organizer/contests/${contest.contestId}/edit`)
  }

  return (
    <InfoSection title={t("contest:info.title")} onEdit={handleEdit}>
      <DetailTable
        data={[
          {
            label: t("contest:info.labels.name"),
            value: safe(contest.name),
          },
          {
            label: t("contest:info.labels.status"),
            value: <StatusBadge status={contest.status} translate={true} />,
          },
          {
            label: t("contest:info.labels.year"),
            value: safe(contest.year),
          },
          { spacer: true },
          {
            label: t("contest:info.labels.registrationStart"),
            value: contest.registrationStart
              ? safe(formatDateTime(contest.registrationStart))
              : t("contest:info.labels.notSet"),
          },
          {
            label: t("contest:info.labels.registrationEnd"),
            value: contest.registrationEnd
              ? safe(formatDateTime(contest.registrationEnd))
              : t("contest:info.labels.notSet"),
          },
          {
            label: t("contest:info.labels.startDate"),
            value: safe(formatDateTime(contest.start)),
          },
          {
            label: t("contest:info.labels.endDate"),
            value: safe(formatDateTime(contest.end)),
          },

          { spacer: true },
          {
            label: t("contest:info.labels.minTeamMembers"),
            value: safe(contest.teamMembersMin, membersSuffix),
          },
          {
            label: t("contest:info.labels.maxTeamMembers"),
            value: safe(contest.teamMembersMax, membersSuffix),
          },
          {
            label: t("contest:info.labels.maxTeams"),
            value: safe(contest.teamLimitMax, teamsSuffix),
          },
          { spacer: true },
          {
            label: t("contest:info.labels.appealSubmitDeadline"),
            value: safe(contest.appealSubmitDays, daysSuffix),
          },
          {
            label: t("contest:info.labels.appealReviewDeadline"),
            value: safe(contest.appealReviewDays, daysSuffix),
          },
          {
            label: t("contest:info.labels.judgeRescoreDeadline"),
            value: safe(contest.judgeRescoreDays, daysSuffix),
          },
          { spacer: true },
          {
            label: t("contest:info.labels.rewards"),
            value: safe(contest.rewardsText),
          },
          { spacer: true },
          {
            label: t("contest:info.labels.description"),
            value: safe(contest.description),
          },
          {
            label: t("contest:info.labels.imageUrl"),
            value: safe(contest.imgUrl),
          },
          {
            label: t("contest:info.labels.createdAt"),
            value: safe(formatDateTime(contest.createdAt)),
          },
        ]}
        labelWidth="198px"
      />
    </InfoSection>
  )
}

export default ContestInfo
