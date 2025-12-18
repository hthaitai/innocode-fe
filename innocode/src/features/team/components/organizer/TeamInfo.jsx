import React from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"

const TeamInfo = ({ team }) => {
  const safe = (val) =>
    val === null || val === undefined || val === "" ? "—" : val

  return (
    <InfoSection title="Team Information">
      <DetailTable
        data={[
          { label: "Team name", value: safe(team.name) },
          { label: "Contest name", value: safe(team.contestName) },
          { label: "School name", value: safe(team.schoolName) },
          { label: "Mentor name", value: safe(team.mentorName) },
          { label: "Created at", value: safe(formatDateTime(team.createdAt)) },
          { label: "Total members", value: safe(team.members?.length) },
        ]}
      />
    </InfoSection>
  )
}

export default TeamInfo
