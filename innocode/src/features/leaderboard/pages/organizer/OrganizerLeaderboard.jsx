import React, { useCallback, useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation(["leaderboard", "pages", "common", "contest"])
  const { contestId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10

  const isValidContestGuid = uuidValidate(contestId)

  const {
    data: contest,
    isLoading: contestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    isError: isLeaderboardError,
    error: leaderboardError,
    refetch: refetchLeaderboard,
  } = useGetLeaderboardByContestQuery({ contestId, pageNumber, pageSize })

  const entries = leaderboardData?.data?.teamIdList ?? []
  const pagination = leaderboardData?.additionalData ?? {}

  const isContestNotFound = !isValidContestGuid || contestError?.status === 404

  const breadcrumbItems = isContestNotFound
    ? BREADCRUMBS.ORGANIZER_CONTEST_DETAIL(t("contest:notFound"))
    : BREADCRUMBS.ORGANIZER_LEADERBOARD(contest?.name ?? "Contest")

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

  if (isContestError || !contest || !isValidContestGuid) {
    const isContestNotFound =
      contestError?.status === 404 || !contest || !isValidContestGuid
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        {isContestNotFound ? (
          <MissingState itemName={t("common:common.contest")} />
        ) : (
          <ErrorState itemName={t("common:common.contest")} />
        )}
      </PageContainer>
    )
  }

  if (isLeaderboardError && leaderboardError?.status !== 404) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="leaderboard" />
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
              {t("leaderboard:leaderboardTitle")}
            </div>
            {leaderboardError?.status === 404 ? (
              <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
                {t("leaderboard:notAvailableYet")}
              </div>
            ) : (
              <ManageLeaderboard
                contestId={contestId}
                entries={entries}
                pagination={pagination}
                setPageNumber={setPageNumber}
              />
            )}
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerLeaderboard
