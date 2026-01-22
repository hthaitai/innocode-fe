import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import PageContainer from "@/shared/components/PageContainer"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import ManageManualResults from "../components/ManageManualResults"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { useFetchOrganizerManualResultsQuery } from "../../../../services/manualProblemApi"
import { useTranslation } from "react-i18next"

const ManualResultsPage = () => {
  const { t } = useTranslation(["common", "breadcrumbs", "errors"])
  const { contestId, roundId } = useParams()

  const [page, setPage] = useState(1)
  const pageSize = 10
  const [studentNameSearch, setStudentNameSearch] = useState("")
  const [teamNameSearch, setTeamNameSearch] = useState("")

  const isValidContestId = uuidValidate(contestId)
  const isValidRoundId = uuidValidate(roundId)

  // Fetch contest, round, and results data
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
    data: resultsData,
    isLoading: resultsLoading,
    isError: resultsError,
  } = useFetchOrganizerManualResultsQuery(
    {
      roundId,
      pageNumber: page,
      pageSize,
      studentNameSearch,
      teamNameSearch,
    },
    { skip: !isValidRoundId },
  )

  const results = resultsData?.data ?? []
  const pagination = resultsData?.additionalData ?? {}

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
    : BREADCRUMBS.ORGANIZER_MANUAL_RESULTS(
        contest?.name ?? round?.contestName ?? t("common.contest"),
        round?.roundName ?? t("common.round"),
      )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MANUAL_RESULTS(
    contestId,
    roundId,
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

  if (resultsError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.manualResults")} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <ManageManualResults
          results={results}
          pagination={pagination}
          onPageChange={setPage}
          setStudentNameSearch={setStudentNameSearch}
          setTeamNameSearch={setTeamNameSearch}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default ManualResultsPage
