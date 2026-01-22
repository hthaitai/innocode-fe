import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import PageContainer from "@/shared/components/PageContainer"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import ManageRubric from "../components/ManageRubric"
import { useFetchRubricQuery } from "../../../../services/manualProblemApi"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { useTranslation } from "react-i18next"

const ManualRubricPage = () => {
  const { t } = useTranslation(["common", "breadcrumbs", "errors"])
  const { roundId, contestId } = useParams()

  const isValidContestId = uuidValidate(contestId)
  const isValidRoundId = uuidValidate(roundId)

  // Fetch contest, round, and rubric data
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
    data: rubricData,
    isLoading: rubricLoading,
    isError: rubricError,
  } = useFetchRubricQuery(roundId, { skip: !isValidRoundId })

  const criteria = rubricData?.data?.criteria ?? []

  const hasContestError = !isValidContestId || isContestError
  const hasRoundError = !isValidRoundId || roundError
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
    : BREADCRUMBS.ORGANIZER_RUBRIC_EDITOR(
        contest?.name ?? round?.contestName ?? t("common.contest"),
        round?.roundName ?? t("common.round"),
      )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_RUBRIC_EDITOR(
    contestId,
    roundId,
  )

  if (contestLoading || roundLoading || rubricLoading) {
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

  if (rubricError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.rubric", { defaultValue: "Rubric" })} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <ManageRubric
          roundId={roundId}
          contestId={contestId}
          criteria={criteria}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default ManualRubricPage
