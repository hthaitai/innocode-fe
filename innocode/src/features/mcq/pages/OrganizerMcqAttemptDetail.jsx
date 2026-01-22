import React from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import { AlertTriangle, Clipboard, Database } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import AttemptInfo from "../components/organizer/AttemptInfo"
import AttemptStatsRow from "../components/organizer/AttemptStatsRow"
import TableFluent from "../../../shared/components/TableFluent"
import { getMcqAttemptDetailColumns } from "../columns/getMcqAttemptDetailColumns"
import { Spinner } from "../../../shared/components/SpinnerFluent"
import { useGetAttemptDetailQuery } from "@/services/mcqApi"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import TableFluentScrollable from "../../../shared/components/table/TableFluentScrollable"
import { AnimatedSection } from "../../../shared/components/ui/AnimatedSection"
import { LoadingState } from "../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../shared/components/ui/MissingState"
import { useTranslation } from "react-i18next"

const OrganizerMcqAttemptDetail = () => {
  const { t } = useTranslation(["common", "breadcrumbs", "errors"])
  const { contestId, roundId, attemptId } = useParams()

  const isValidContestId = uuidValidate(contestId)
  const isValidRoundId = uuidValidate(roundId)
  const isValidAttemptId = uuidValidate(attemptId)

  // Fetch contest, round, and attempt data
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
    data: attempt,
    isLoading: attemptLoading,
    isError: attemptError,
    error: attemptErrorObj,
  } = useGetAttemptDetailQuery(attemptId, { skip: !isValidAttemptId })

  const hasContestError = !isValidContestId || isContestError
  const hasRoundError = !isValidRoundId || roundError
  const hasAttemptError = !isValidAttemptId || attemptError
  const hasError = hasContestError || hasRoundError || hasAttemptError

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
        ...(!hasContestError && !hasRoundError ? ["Quiz attempts"] : []),
        ...(hasAttemptError && !hasContestError && !hasRoundError
          ? [t("errors:common.notFound")]
          : []),
      ]
    : BREADCRUMBS.ORGANIZER_MCQ_ATTEMPT_DETAIL(
        contest?.name ?? round?.contestName ?? t("common.contest"),
        round?.roundName ?? t("common.round"),
        attempt?.studentName ?? t("common.studentName"),
      )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MCQ_ATTEMPT_DETAIL(
    contestId,
    roundId,
    attemptId,
  )

  if (contestLoading || roundLoading || attemptLoading) {
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

  if (roundError || !round || !isValidRoundId) {
    let errorMessage = null

    // Handle specific error status codes for round
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

  if (attemptError || !attempt || !isValidAttemptId) {
    let errorMessage = null

    // Handle specific error status codes for attempt
    if (!isValidAttemptId) {
      errorMessage = t("errors:common.invalidId")
    } else if (attemptErrorObj?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (attemptErrorObj?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.attempt")} message={errorMessage} />
      </PageContainer>
    )
  }

  const {
    totalQuestions,
    correctAnswers,
    score,
    totalPossibleScore,
    answerResults,
  } = attempt

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <div className="space-y-5">
          <AttemptStatsRow
            totalQuestions={totalQuestions}
            correctAnswers={correctAnswers}
            score={score}
            totalPossibleScore={totalPossibleScore}
          />

          <div>
            <div className="text-sm font-semibold pt-3 pb-2">
              {t("common.information")}
            </div>
            <AttemptInfo attemptDetail={attempt} />
          </div>

          <div>
            <div className="text-sm font-semibold pt-3 pb-2">
              {t("common.attemptReview")}
            </div>
            <TableFluentScrollable
              data={answerResults}
              columns={getMcqAttemptDetailColumns(t)}
              maxHeight={400}
            />
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerMcqAttemptDetail
