import React, { useCallback, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { Trophy } from "lucide-react"
import ToggleSwitchFluent from "@/shared/components/ToggleSwitchFluent"
import { formatDateTime } from "@/shared/utils/dateTime"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import {
  useGetLeaderboardByContestQuery,
  useToggleFreezeLeaderboardMutation,
} from "@/services/leaderboardApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { getContestLeaderboardColumns } from "../../columns/getContestLeaderboardColumns"

const OrganizerLeaderboard = () => {
  const { contestId } = useParams()
  const [isFrozen, setIsFrozen] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const navigate = useNavigate()

  // Fetch contest info
  const {
    data: contest,
    isLoading: contestLoading,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !contestId })

  // Fetch leaderboard with pagination
  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useGetLeaderboardByContestQuery(
    { contestId, pageNumber, pageSize },
    { skip: !contestId }
  )

  // Toggle freeze mutation
  const [toggleFreeze, { isLoading: isTogglingFreeze }] =
    useToggleFreezeLeaderboardMutation()

  const entries = leaderboardData?.data?.teamIdList || []
  const pagination = leaderboardData?.additionalData || {}

  const isNoEntries =
    leaderboardError?.status === 404 &&
    leaderboardError?.data?.errorCode === "NOT_FOUND!"

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_LEADERBOARD(
    contest?.name ?? "Contest"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_LEADERBOARD(contestId)

  const handleFreezeToggle = async (newState) => {
    try {
      const response = await toggleFreeze(contestId).unwrap()
      setIsFrozen(newState)
      const message = response?.message || response?.data?.message
      if (message) {
        toast.success(message)
      } else {
        toast.success(
          newState
            ? "Leaderboard frozen successfully"
            : "Leaderboard unfrozen successfully"
        )
      }
    } catch (error) {
      console.error("Failed to toggle freeze:", error)
      // Revert the toggle on error
      setIsFrozen(!newState)
      const errorMessage =
        error?.data?.message || error?.message || "Failed to toggle freeze"
      toast.error(errorMessage)
    }
  }

  const columns = getContestLeaderboardColumns()

  const loading = contestLoading || leaderboardLoading
  const error = contestError || leaderboardError

  const handleRowClick = useCallback(
    (team) => {
      navigate(`/organizer/contests/${contestId}/leaderboard/teams/${team.teamId}`)
    },
    [navigate, contestId]
  )

  // If no entries
  if (isNoEntries && !leaderboardLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          No entries available.
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={loading}
    >
      <TableFluent
        data={entries}
        columns={columns}
        title="Leaderboard"
        pagination={pagination}
        onRowClick={handleRowClick}
        renderActions={() => {
          return (
            <div className="min-h-[70px] flex items-center justify-between px-5">
              <p className="text-[14px] leading-[20px] font-medium">Leaderboard</p>

              {/* Toggle Switch */}
              <ToggleSwitchFluent
                enabled={isFrozen}
                onChange={handleFreezeToggle}
                labelLeft="Freeze"
                labelRight="Unfreeze"
                labelPosition="left"
              />
            </div>
          )
        }}
      />
    </PageContainer>
  )
}

export default OrganizerLeaderboard
