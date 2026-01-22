import React, { useState } from "react"
import { validate as uuidValidate } from "uuid"
import {
  useFetchManualSubmissionsQuery,
  useLazyDownloadSubmissionQuery,
} from "../../../../services/submissionApi"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import PageContainer from "../../../../shared/components/PageContainer"
import JudgeSubmissionsList from "../../../submission/components/judge/JudgeSubmissionsList"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import JudgeSubmissionsActions from "../../../problems/manual/components/JudgeSubmissionsActions"
import { useParams, useNavigate } from "react-router-dom"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { useTranslation } from "react-i18next"

const JudgeManualSubmissionsPage = () => {
  const { t } = useTranslation(["judge", "common", "errors"])
  const { contestId, roundId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10
  const [statusFilter, setStatusFilter] = useState("Pending")
  const navigate = useNavigate()

  const isValidContestId = uuidValidate(contestId)
  const isValidRoundId = uuidValidate(roundId)

  const {
    data: contestData,
    isLoading: isContestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const roundData = contestData?.rounds?.find((r) => r.roundId === roundId)

  const {
    data: submissionsData,
    isLoading: isSubmissionsLoading,
    isError: isSubmissionsError,
  } = useFetchManualSubmissionsQuery(
    {
      statusFilter,
      pageNumber,
      pageSize,
      roundIdSearch: roundId,
    },
    { skip: !isValidContestId || !isValidRoundId },
  )

  const submissions = submissionsData?.data ?? []
  console.log(submissions)
  const pagination = submissionsData?.additionalData ?? {}

  const hasContestError = !isValidContestId || isContestError
  const hasRoundError = !isValidRoundId || (contestData && !roundData)
  const hasError = hasContestError || hasRoundError

  // Breadcrumbs - Update to show "Not found" for error states
  // If round is invalid/not found: "Contests > [Contest Name] > Not found"
  const breadcrumbItems = hasError
    ? [
        "Contests",
        hasContestError ? t("errors:common.notFound") : contestData?.name,
        ...(hasRoundError && !hasContestError
          ? [t("errors:common.notFound")]
          : []),
      ]
    : BREADCRUMBS.JUDGE_ROUND_SUBMISSIONS(
        roundData?.contestName ?? t("manualSubmissions.fallbacks.contest"),
        roundData?.name ?? t("manualSubmissions.fallbacks.round"),
      )

  const breadcrumbPaths = BREADCRUMB_PATHS.JUDGE_ROUND_SUBMISSIONS(
    contestId,
    roundId,
  )

  if (isContestLoading || isSubmissionsLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isContestError || !contestData || !isValidContestId) {
    let errorMessage = null

    // Handle specific error status codes for contest
    if (!isValidContestId) {
      errorMessage = t("errors:common.invalidId")
    } else if (contestError?.status === 404) {
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

  if (!roundData || !isValidRoundId) {
    let errorMessage = null

    // Handle specific error for round
    if (!isValidRoundId) {
      errorMessage = t("errors:common.invalidId")
    } else if (!roundData) {
      errorMessage = t("errors:common.notFound")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common:common.round")}
          message={errorMessage}
        />
      </PageContainer>
    )
  }

  if (isSubmissionsError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("manualSubmissions.errors.submissions")} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <JudgeSubmissionsActions
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <JudgeSubmissionsList
          contestId={contestId}
          roundId={roundId}
          submissions={submissions}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default JudgeManualSubmissionsPage
