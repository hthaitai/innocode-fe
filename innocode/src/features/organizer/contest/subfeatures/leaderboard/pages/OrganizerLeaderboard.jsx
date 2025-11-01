import React, { useState } from "react"
import { useParams } from "react-router-dom"
import PageContainer from '@/shared/components/PageContainer'
import TableFluent from '@/shared/components/TableFluent'
import { Trophy } from "lucide-react"
import useLeaderboard from '@/features/contest/subfeatures/leaderboard/hooks/useLeaderboard'
import { formatDateTime } from "@/shared/utils/formatDateTime"
import { useOrganizerBreadcrumb } from '@/features/organizer/hooks/useOrganizerBreadcrumb'
import useTeams from '@/features/contest/subfeatures/teams/hooks/useTeams'
import ToggleSwitchFluent from '@/shared/components/ToggleSwitchFluent'

const OrganizerLeaderboard = () => {
  const { breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_LEADERBOARD")
  const { contestId } = useParams()
  const { leaderboard, loading, error } = useLeaderboard(contestId)
  const { teams } = useTeams()

  const [isFrozen, setIsFrozen] = useState(false) // <-- track freeze state

  // ----- Table Columns -----
  const leaderboardColumns = [
    {
      accessorKey: "rank",
      header: "Rank",
      cell: ({ row }) => row.original.rank ?? "—",
    },
    {
      accessorKey: "team_id",
      header: "Team",
      cell: ({ row }) =>
        teams.find((t) => t.team_id === row.original.team_id)?.name || "—",
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => (row.original.score ?? 0).toFixed(2),
    },
    {
      accessorKey: "snapshot_at",
      header: "Last Updated",
      cell: ({ row }) => formatDateTime(row.original.snapshot_at),
    },
  ]

  // ----- Handle Toggle -----
  const handleFreezeToggle = (newState) => {
    setIsFrozen(newState)
    alert("Leaderboard changed", newState)
    // TODO: call freeze/unfreeze API if needed
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      loading={loading}
      error={error}
    >
      <div className="space-y-1">
        {/* Leaderboard Header Section */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <Trophy size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">
                Leaderboard
              </p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                View current contest standings, toggle freeze leaderboard
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <ToggleSwitchFluent
            enabled={isFrozen}
            onChange={handleFreezeToggle}
            labelLeft="Freeze"
            labelRight="Unfreeze"
            labelPosition="left"
          />
        </div>

        {/* Table */}
        <TableFluent
          data={leaderboard}
          columns={leaderboardColumns}
          title="Leaderboard"
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerLeaderboard
