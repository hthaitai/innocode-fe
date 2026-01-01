import React, { useCallback, useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { Trophy, WifiOff } from "lucide-react"
import ToggleSwitchFluent from "@/shared/components/ToggleSwitchFluent"
import { formatDateTime } from "@/shared/utils/dateTime"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import {
  useGetLeaderboardByContestQuery,
  useToggleFreezeLeaderboardMutation,
} from "@/services/leaderboardApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { getContestLeaderboardColumns } from "../../columns/getContestLeaderboardColumns"
import { useLiveLeaderboard } from "../../hooks/useLiveLeaderboard"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import TablePagination from "../../../../shared/components/TablePagination"
import LeaderboardActions from "../../components/LeaderboardActions"
import ManageLeaderboard from "../../components/ManageLeaderboard"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"

const OrganizerLeaderboard = () => {
  const { contestId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10

  const {
    data: contest,
    isLoading: contestLoading,
    error: contestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    error: leaderboardError,
    refetch: refetchLeaderboard,
  } = useGetLeaderboardByContestQuery({ contestId, pageNumber, pageSize })

  console.log(leaderboardData)

  const entries = leaderboardData?.data?.teamIdList ?? []
  const pagination = leaderboardData?.additionalData ?? {}

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_LEADERBOARD(
    contest?.name ?? "Contest"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_LEADERBOARD(contestId)

  if (contestLoading || leaderboardLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (contestError || leaderboardError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="leaderboard" />
      </PageContainer>
    )
  }

  if (!contest) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName="contest" />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <div className="space-y-5">
          <LeaderboardActions
            contestId={contestId}
            refetchLeaderboard={refetchLeaderboard}
          />

          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              Leaderboard
            </div>
            <ManageLeaderboard
              contestId={contestId}
              entries={entries}
              pagination={pagination}
              setPageNumber={setPageNumber}
            />
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerLeaderboard
