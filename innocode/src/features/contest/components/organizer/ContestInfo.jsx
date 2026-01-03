import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "../../../../shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import StatusBadge from "../../../../shared/components/StatusBadge"
import { useTranslation } from "react-i18next"

const ContestInfo = ({ contest }) => {
  const navigate = useNavigate()
  const { t } = useTranslation("pages")

  const safe = (val, suffix = "") => {
    if (val === null || val === undefined || val === "") return "—"
    const text = typeof suffix === "function" ? suffix(val) : suffix
    return `${val}${text}`
  }

  const daysSuffix = (val) =>
    Number(val) === 1
      ? t("organizerContestDetail.info.labels.day")
      : t("organizerContestDetail.info.labels.days")

  // Move edit logic here
  const handleEdit = () => {
    if (!contest) return
    navigate(`/organizer/contests/${contest.contestId}/edit`)
  }

  return (
    <InfoSection
      title={t("organizerContestDetail.info.title")}
      onEdit={handleEdit}
    >
      <DetailTable
        data={[
          {
            label: t("organizerContestDetail.info.labels.name"),
            value: safe(contest.name),
          },
          {
            label: t("organizerContestDetail.info.labels.status"),
            value: <StatusBadge status={contest.status} translate={true} />,
          },
          {
            label: t("organizerContestDetail.info.labels.year"),
            value: safe(contest.year),
          },
          { spacer: true },
          {
            label: t("organizerContestDetail.info.labels.startDate"),
            value: safe(formatDateTime(contest.start)),
          },
          {
            label: t("organizerContestDetail.info.labels.endDate"),
            value: safe(formatDateTime(contest.end)),
          },
          {
            label: t("organizerContestDetail.info.labels.registrationStart"),
            value: contest.registrationStart
              ? safe(formatDateTime(contest.registrationStart))
              : t("organizerContestDetail.info.labels.notSet"),
          },
          {
            label: t("organizerContestDetail.info.labels.registrationEnd"),
            value: contest.registrationEnd
              ? safe(formatDateTime(contest.registrationEnd))
              : t("organizerContestDetail.info.labels.notSet"),
          },
          { spacer: true },
          {
            label: t("organizerContestDetail.info.labels.minTeamMembers"),
            value: safe(contest.teamMembersMin),
          },
          {
            label: t("organizerContestDetail.info.labels.maxTeamMembers"),
            value: safe(contest.teamMembersMax),
          },
          {
            label: t("organizerContestDetail.info.labels.maxTeams"),
            value: safe(contest.teamLimitMax),
          },
          { spacer: true },
          {
            label: t("organizerContestDetail.info.labels.appealSubmitDeadline"),
            value: safe(contest.appealSubmitDays, daysSuffix),
          },
          {
            label: t("organizerContestDetail.info.labels.appealReviewDeadline"),
            value: safe(contest.appealReviewDays, daysSuffix),
          },
          {
            label: t("organizerContestDetail.info.labels.judgeRescoreDeadline"),
            value: safe(contest.judgeRescoreDays, daysSuffix),
          },
          { spacer: true },
          {
            label: t("organizerContestDetail.info.labels.rewards"),
            value: safe(contest.rewardsText),
          },
          { spacer: true },
          {
            label: t("organizerContestDetail.info.labels.description"),
            value: safe(contest.description),
          },
          {
            label: t("organizerContestDetail.info.labels.imageUrl"),
            value: safe(contest.imgUrl),
          },
          {
            label: t("organizerContestDetail.info.labels.createdAt"),
            value: safe(formatDateTime(contest.createdAt)),
          },
        ]}
        labelWidth="198px"
      />
    </InfoSection>
  )
}

export default ContestInfo
