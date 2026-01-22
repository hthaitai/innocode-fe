import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { validate as uuidValidate } from "uuid"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetLeaderboardByContestQuery } from "@/services/leaderboardApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import LeaderboardActions from "../../components/LeaderboardActions"
import ManageLeaderboard from "../../components/ManageLeaderboard"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"

import { useLiveLeaderboard } from "../../hooks/useLiveLeaderboard"
import LeaderboardStatusInfo from "../../components/LeaderboardStatusInfo"

const OrganizerLeaderboard = () => {
  const { t } = useTranslation([
    "leaderboard",
    "pages",
    "common",
    "contest",
    "errors",
  ])
  const { contestId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10

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

  const [isFrozen, setIsFrozen] = useState(false)

  useEffect(() => {
    if (leaderboardData?.data?.isFrozen !== undefined) {
      setIsFrozen(leaderboardData.data.isFrozen)
    }
  }, [leaderboardData])

  const { isConnected } = useLiveLeaderboard(
    contestId,
    refetchLeaderboard,
    !!contestId && !isFrozen,
  )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_LEADERBOARD(contestId)

  // Validate UUID format first
  const isValidUuid = uuidValidate(contestId)
  const hasError = !isValidUuid || isContestError

  // Update breadcrumb to show "Not found" for error states
  // For errors: ["Contests", "Not found"] instead of ["Contests", "Not found", "Leaderboard"]
  const breadcrumbItems = hasError
    ? ["Contests", t("errors:common.notFound")]
    : BREADCRUMBS.ORGANIZER_LEADERBOARD(
        contest?.name ?? t("common:common.contest"),
      )

  if (!isValidUuid) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common:common.contest")}
          message={t("errors:common.invalidId")}
        />
      </PageContainer>
    )
  }

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
    let errorMessage = null

    // Handle specific error status codes
    if (contestError?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (contestError?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common:common.contest")}
          message={errorMessage}
        />
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
          <div className="space-y-10">
            <LeaderboardStatusInfo
              isFrozen={isFrozen}
              isConnected={isConnected}
            />
            <LeaderboardActions
              contestId={contestId}
              refetchLeaderboard={refetchLeaderboard}
              isFrozen={isFrozen}
              setIsFrozen={setIsFrozen}
            />
          </div>

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
