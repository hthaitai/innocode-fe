import React, { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { useGetAttemptsQuery } from "@/services/mcqApi"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import { getMcqAttemptsColumns } from "../columns/getMcqAttemptsColumns"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { Users } from "lucide-react"
import { AnimatedSection } from "../../../shared/components/ui/AnimatedSection"
import { Spinner } from "../../../shared/components/SpinnerFluent"
import { LoadingState } from "../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../shared/components/ui/MissingState"

const OrganizerMcqAttempts = () => {
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()

  const [page, setPage] = useState(1)
  const pageSize = 10

  // Fetch attempts for the round
  const {
    data: attemptsData,
    isLoading: attemptsLoading,
    isError: attemptsError,
  } = useGetAttemptsQuery({
    roundId,
    pageNumber: page,
    pageSize,
  })
  const {
    data: round,
    isLoading: roundLoading,
    isError: roundError,
  } = useGetRoundByIdQuery(roundId)

  const attempts = attemptsData?.data ?? []
  const pagination = attemptsData?.additionalData ?? {}

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_MCQ_ATTEMPTS(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MCQ_ATTEMPTS(
    contestId,
    roundId
  )

  // Columns for the table
  const columns = getMcqAttemptsColumns()

  const handleRowClick = (attemptId) => {
    navigate(
      `/organizer/contests/${contestId}/rounds/${roundId}/attempts/${attemptId}`
    )
  }

  if (attemptsLoading || roundLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (attemptsError || roundError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="attempts" />
      </PageContainer>
    )
  }

  if (!round) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName="round" />
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
