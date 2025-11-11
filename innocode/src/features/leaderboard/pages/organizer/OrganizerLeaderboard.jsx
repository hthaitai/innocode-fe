import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { Trophy } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { formatDateTime } from "@/shared/utils/dateTime"
import ToggleSwitchFluent from "@/shared/components/ToggleSwitchFluent"
import useLeaderboardSignalR from "@/features/leaderboard/hooks/useLeaderboardSignalR"
import { fetchLeaderboardByContest } from "@/features/leaderboard/store/leaderboardThunk"
import { fetchContests } from "@/features/contest/store/contestThunks"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

const OrganizerLeaderboard = () => {
  const { contestId } = useParams()
  const dispatch = useAppDispatch()

  const { contests } = useAppSelector((s) => s.contests)
  const { entries, loading, error } = useAppSelector(
    (state) => state.leaderboard
  )

  const [isFrozen, setIsFrozen] = useState(false)

  const contest = contests.find(
    (c) => String(c.contestId) === String(contestId)
  )

  useEffect(() => {
    if (!contest && contestId) {
      dispatch(fetchContests({ pageNumber: 1, pageSize: 50 }))
    }
  }, [contest, contestId, dispatch])

  useEffect(() => {
    if (!contestId) return
    dispatch(fetchLeaderboardByContest({ contestId }))
  }, [contestId, dispatch])

  useLeaderboardSignalR(contestId, isFrozen)

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_LEADERBOARD(
    contest?.name ?? "Contest"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_LEADERBOARD(contestId)

  const handleFreezeToggle = (newState) => {
    setIsFrozen(newState)
    // Optional: call backend API to freeze/unfreeze leaderboard
  }

  const leaderboardColumns = [
    {
      accessorKey: "rank",
      header: "Rank",
      cell: ({ row }) => row.original.rank ?? "—",
    },
    {
      accessorKey: "teamName",
      header: "Team",
      cell: ({ row }) => row.original.teamName ?? "—",
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => (row.original.score ?? 0).toFixed(2),
    },
    {
      accessorKey: "snapshotAt",
      header: "Last Updated",
      cell: ({ row }) => formatDateTime(row.original.snapshotAt),
    },
  ]

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={loading}
      error={error}
    >
      <div className="space-y-1">
        {/* Leaderboard Header Section */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <Trophy size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">Leaderboard</p>
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
          data={entries}
          columns={leaderboardColumns}
          title="Leaderboard"
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerLeaderboard
