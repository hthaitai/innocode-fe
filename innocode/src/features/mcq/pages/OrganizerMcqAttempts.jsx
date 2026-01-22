import React, { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { useGetAttemptsQuery } from "@/services/mcqApi"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { getMcqAttemptsColumns } from "../columns/getMcqAttemptsColumns"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { Users } from "lucide-react"
import { AnimatedSection } from "../../../shared/components/ui/AnimatedSection"
import { Spinner } from "../../../shared/components/SpinnerFluent"
import { LoadingState } from "../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../shared/components/ui/MissingState"
import { useTranslation } from "react-i18next"

const OrganizerMcqAttempts = () => {
  const { t } = useTranslation(["common", "breadcrumbs", "errors"])
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()

  const [page, setPage] = useState(1)
  const pageSize = 10

  const isValidContestId = uuidValidate(contestId)
  const isValidRoundId = uuidValidate(roundId)

  // Fetch contest, round, and attempts data
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
    data: attemptsData,
    isLoading: attemptsLoading,
    isError: attemptsError,
  } = useGetAttemptsQuery(
    {
      roundId,
      pageNumber: page,
      pageSize,
    },
    { skip: !isValidRoundId },
  )

  const attempts = attemptsData?.data ?? []
  const pagination = attemptsData?.additionalData ?? {}

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
    : BREADCRUMBS.ORGANIZER_MCQ_ATTEMPTS(
        contest?.name ?? round?.contestName ?? t("common.contest"),
        round?.roundName ?? t("common.round"),
      )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MCQ_ATTEMPTS(
    contestId,
    roundId,
  )

  // Columns for the table
  const columns = getMcqAttemptsColumns(t)

  const handleRowClick = (attemptId) => {
    navigate(
      `/organizer/contests/${contestId}/rounds/${roundId}/attempts/${attemptId}`,
    )
  }

  if (contestLoading || roundLoading || attemptsLoading) {
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

  if (attemptsError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.attempts")} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <TableFluent
          data={attempts}
          columns={columns}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={(attempt) => handleRowClick(attempt.attemptId)}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerMcqAttempts
