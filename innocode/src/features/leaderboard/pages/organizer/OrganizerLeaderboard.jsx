import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetLeaderboardByContestQuery } from "@/services/leaderboardApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import LeaderboardActions from "../../components/LeaderboardActions"
import ManageLeaderboard from "../../components/ManageLeaderboard"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"

const OrganizerLeaderboard = () => {
  const { t } = useTranslation(["leaderboard", "pages", "common", "contest"])
  const { contestId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10

  const {
    data: contest,
    isLoading: contestLoading,
    isError: isContestError,
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

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_LEADERBOARD(
    contest?.name ?? t("common:common.contest")
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

  if (isContestError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common:common.contest")} />
      </PageContainer>
    )
  }

  if (isLeaderboardError && leaderboardError?.status !== 404) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("leaderboard:leaderboardTitle")} />
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
