import React from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useNavigate } from "react-router-dom"
import StatusBadge from "../../../../shared/components/StatusBadge"

const ContestInfo = ({ contest }) => {
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate(`/organizer/contests/${contest.contestId}/edit`)
  }

  return (
    <InfoSection title="Contest Information" onEdit={handleEdit}>
      <DetailTable
        data={[
          { label: "Name", value: contest.name },
          { label: "Status", value: <StatusBadge status={contest.status} /> },
          { label: "Year", value: contest.year },
          { spacer: true },
          { label: "Start Date", value: formatDateTime(contest.start) },
          { label: "End Date", value: formatDateTime(contest.end) },
          { label: "Registration Start", value: contest.registrationStart ? formatDateTime(contest.registrationStart) : "Not set" },
          { label: "Registration End", value: contest.registrationEnd ? formatDateTime(contest.registrationEnd) : "Not set" },
          { spacer: true },
          { label: "Max Team Members", value: contest.teamMembersMax ?? "Not set" },
          { label: "Max Teams", value: contest.teamLimitMax ?? "Not set" },
          { label: "Rewards", value: contest.rewardsText ?? "Not set" },
          { spacer: true },
          { label: "Description", value: contest.description },
          { label: "Image URL", value: contest.imgUrl },
          { label: "Created At", value: formatDateTime(contest.createdAt) },
        ]}
      />
    </InfoSection>
  )
}

export default ContestInfo
