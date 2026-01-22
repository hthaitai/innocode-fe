import React from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import PageContainer from "@/shared/components/PageContainer"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useGetManualTestResultBySubmissionIdQuery } from "@/services/manualProblemApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import ManualResultInfo from "../components/ManualResultInfo"
import ManualResultRubricScores from "../components/ManualResultRubricScores"
import { useTranslation } from "react-i18next"

const ManualResultDetailPage = () => {
  const { t } = useTranslation(["common", "breadcrumbs", "errors"])
  const { contestId, roundId, submissionId } = useParams()

  const isValidContestId = uuidValidate(contestId)
  const isValidRoundId = uuidValidate(roundId)
  const isValidSubmissionId = uuidValidate(submissionId)

  // Fetch contest, round, and submission data
  const {
    data: contest,
    isLoading: contestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const {
    data: round,
    isLoading: roundLoading,
    isError: roundError,
    error: roundErrorObj,
  } = useGetRoundByIdQuery(roundId, { skip: !isValidRoundId })

  const {
    data: submission,
    isLoading: resultsLoading,
    isError: resultsError,
    error: submissionErrorObj,
  } = useGetManualTestResultBySubmissionIdQuery(
    {
      roundId,
      submissionId,
    },
    { skip: !isValidRoundId || !isValidSubmissionId },
  )

  const hasContestError = !isValidContestId || isContestError
  const hasRoundError = !isValidRoundId || roundError
  const hasSubmissionError = !isValidSubmissionId || resultsError
  const hasError = hasContestError || hasRoundError || hasSubmissionError

  // Breadcrumbs - Update to show "Not found" for error states
  const breadcrumbItems = hasError
    ? [
        "Contests",
        hasContestError ? t("errors:common.notFound") : contest?.name,
        ...(hasRoundError && !hasContestError
          ? [t("errors:common.notFound")]
          : !hasRoundError && !hasContestError
            ? [round?.roundName]
            : []),
        ...(!hasContestError && !hasRoundError ? ["Manual results"] : []),
        ...(hasSubmissionError && !hasContestError && !hasRoundError
          ? [t("errors:common.notFound")]
          : []),
      ]
    : BREADCRUMBS.ORGANIZER_MANUAL_RESULT_DETAIL(
        contest?.name ?? round?.contestName ?? t("common.contest"),
        round?.roundName ?? t("common.round"),
        submission?.studentName ?? t("common.studentName"),
      )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MANUAL_RESULT_DETAIL(
    contestId,
    roundId,
    submissionId,
  )

  if (contestLoading || roundLoading || resultsLoading) {
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

  if (roundError || !round || !isValidRoundId) {
    let errorMessage = null

    if (!isValidRoundId) {
      errorMessage = t("errors:common.invalidId")
    } else if (roundErrorObj?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (roundErrorObj?.status === 403) {
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

  if (resultsError || !submission || !isValidSubmissionId) {
    let errorMessage = null

    if (!isValidSubmissionId) {
      errorMessage = t("errors:common.invalidId")
    } else if (submissionErrorObj?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (submissionErrorObj?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common.submission", { defaultValue: "Submission" })}
          message={errorMessage}
        />
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
          <ManualResultInfo submission={submission} />

          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              {t("common.submissionCriteria")}
            </div>
            <ManualResultRubricScores
              criteriaScores={submission.criterionResults}
            />
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default ManualResultDetailPage
