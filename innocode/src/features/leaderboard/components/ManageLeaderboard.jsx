import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import TableFluent from "@/shared/components/TableFluent"
import TablePagination from "@/shared/components/TablePagination"
import { useGetLeaderboardByContestQuery } from "@/services/leaderboardApi"
import { getContestLeaderboardColumns } from "../columns/getContestLeaderboardColumns"
import LeaderboardToolbar from "./LeaderboardToolbar"

const ManageLeaderboard = ({
  contestId,
  entries,
  pagination,
  setPageNumber,
}) => {
  const navigate = useNavigate()

  const handleRowClick = useCallback(
    (team) => {
      navigate(
        `/organizer/contests/${contestId}/leaderboard/teams/${team.teamId}`
      )
    },
    [navigate, contestId]
  )

  const columns = getContestLeaderboardColumns()

  return (
    <>
      <LeaderboardToolbar contestId={contestId} />

      <TableFluent
        data={entries}
        columns={columns}
        onRowClick={handleRowClick}
      />

      {entries?.length > 0 && (
        <TablePagination pagination={pagination} onPageChange={setPageNumber} />
      )}
    </>
  )
}

export default ManageLeaderboard
