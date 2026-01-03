import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "../../../../shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import StatusBadge from "../../../../shared/components/StatusBadge"

const ContestInfo = ({ contest }) => {
  const navigate = useNavigate()

  const safe = (val, suffix = "") => {
    if (val === null || val === undefined || val === "") return "—"
    const text = typeof suffix === "function" ? suffix(val) : suffix
    return `${val}${text}`
  }

  const daysSuffix = (val) => (Number(val) === 1 ? " day" : " days")

  // Move edit logic here
  const handleEdit = () => {
    if (!contest) return
    navigate(`/organizer/contests/${contest.contestId}/edit`)
  }

  return (
    <InfoSection title="Contest Information" onEdit={handleEdit}>
      <DetailTable
        data={[
          { label: "Name", value: safe(contest.name) },
          {
            label: "Status",
            value: <StatusBadge status={contest.status} translate={true} />,
          },
          { label: "Year", value: safe(contest.year) },
          { spacer: true },
          {
            label: "Contest start date",
            value: safe(formatDateTime(contest.start)),
          },
          {
            label: "Contest end date",
            value: safe(formatDateTime(contest.end)),
          },
          {
            label: "Registration start date",
            value: contest.registrationStart
              ? safe(formatDateTime(contest.registrationStart))
              : "Not set",
          },
          {
            label: "Registration end date",
            value: contest.registrationEnd
              ? safe(formatDateTime(contest.registrationEnd))
              : "Not set",
          },
          { spacer: true },
          { label: "Min team members", value: safe(contest.teamMembersMin) },
          { label: "Max team members", value: safe(contest.teamMembersMax) },
          { label: "Max teams", value: safe(contest.teamLimitMax) },
          { spacer: true },
          {
            label: "Appeal submission deadline",
            value: safe(contest.appealSubmitDays, daysSuffix),
          },
          {
            label: "Appeal review deadline",
            value: safe(contest.appealReviewDays, daysSuffix),
          },
          {
            label: "Judge rescore deadline",
            value: safe(contest.judgeRescoreDays, daysSuffix),
          },
          { spacer: true },
          { label: "Rewards", value: safe(contest.rewardsText) },
          { spacer: true },
          { label: "Description", value: safe(contest.description) },
          { label: "Image URL", value: safe(contest.imgUrl) },
          {
            label: "Created at",
            value: safe(formatDateTime(contest.createdAt)),
          },
        ]}
        labelWidth="198px"
      />
    </InfoSection>
  )
}

export default ContestInfo
