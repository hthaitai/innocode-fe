import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import ManageMcqs from "../components/organizer/ManageMcqs"
import { useGetRoundByIdQuery } from "../../../services/roundApi"
import { LoadingState } from "../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../shared/components/ui/ErrorState"
import { useGetRoundMcqsQuery } from "../../../services/mcqApi"
import { AnimatedSection } from "../../../shared/components/ui/AnimatedSection"
import { useTranslation } from "react-i18next"
import { useGetContestByIdQuery } from "../../../services/contestApi"

const OrganizerMcq = () => {
  const { t } = useTranslation([
    "common",
    "breadcrumbs",
    "contest",
    "round",
    "errors",
  ])
  const { contestId, roundId } = useParams()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const isValidContestId = uuidValidate(contestId)
  const isValidRoundId = uuidValidate(roundId)

  const {
    data: contest,
    isLoading: contestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const {
    data: round,
    isLoading: roundLoading,
    isError: isRoundError,
    error: roundError,
  } = useGetRoundByIdQuery(roundId, { skip: !isValidRoundId })

  const {
    data: mcqData,
    isLoading: mcqLoading,
    isError: mcqError,
  } = useGetRoundMcqsQuery(
    { roundId, pageNumber: page, pageSize },
    { skip: !isValidRoundId },
  )

  const testId = mcqData?.data?.mcqTest?.testId
  const mcqs = mcqData?.data?.mcqTest?.questions ?? []
  const pagination = mcqData?.additionalData ?? {}

  const hasContestError = !isValidContestId || isContestError
  const hasRoundError = !isValidRoundId || isRoundError
  const hasError = hasContestError || hasRoundError

  // Breadcrumbs - Update to show "Not found" for error states
  const breadcrumbItems = hasError
    ? [
        "Contests",
        hasContestError ? t("errors:common.notFound") : contest?.name,
        ...(hasRoundError && !hasContestError
          ? [t("errors:common.notFound")]
          : []),
      ]
    : BREADCRUMBS.ORGANIZER_MCQ(
        contest?.name ?? t("common.contest"),
        round?.roundName ?? t("common.round"),
      )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MCQ(contestId, roundId)

  if (contestLoading || roundLoading || mcqLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isContestError || !contest || !isValidContestId) {
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
        <ErrorState itemName={t("common.contest")} message={errorMessage} />
      </PageContainer>
    )
  }

  if (isRoundError || !round || !isValidRoundId) {
    let errorMessage = null

    // Handle specific error status codes for round
    if (!isValidRoundId) {
      errorMessage = t("errors:common.invalidId")
    } else if (roundError?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (roundError?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.round")} message={errorMessage} />
      </PageContainer>
    )
  }

  if (mcqError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("questions", { ns: "breadcrumbs" })} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <ManageMcqs
          mcqs={mcqs}
          pagination={pagination}
          setPage={setPage}
          testId={testId}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerMcq
