import React from "react"
import InfoSection from "../../../shared/components/InfoSection"
import DetailTable from "../../../shared/components/DetailTable"
import { formatScore } from "@/shared/utils/formatNumber"
import StatusBadge from "@/shared/components/StatusBadge"

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
          { label: "Team score", value: formatScore(team.score) },
          { label: "Total members", value: safe(team.members?.length ?? 0) },
          {
            label: "Status",
            value: team.status ? (
              <StatusBadge status={team.status} translate="team" />
            ) : (
              "—"
            ),
          },
        ]}
      />
    </InfoSection>
  )
}

export default LeaderboardTeamInfo
