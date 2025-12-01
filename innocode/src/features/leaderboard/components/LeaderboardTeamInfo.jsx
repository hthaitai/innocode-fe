import React from "react"
import InfoSection from "../../../shared/components/InfoSection"
import DetailTable from "../../../shared/components/DetailTable"

const LeaderboardTeamInfo = ({ team }) => {
  if (!team) return null

  const safe = (val) =>
    val === null || val === undefined || val === "" ? "—" : val

  return (
    <InfoSection title="Team Information">
      <DetailTable
        data={[
          { label: "Team name", value: safe(team.teamName) },
          { label: "Rank", value: safe(team.rank) },
          { label: "Team score", value: safe(team.score) },
          { label: "Total members", value: safe(team.members?.length ?? 0) },
        ]}
      />
    </InfoSection>
  )
}

export default LeaderboardTeamInfo
