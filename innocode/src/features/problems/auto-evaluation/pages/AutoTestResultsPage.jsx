import React, { useState } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import ManageAutoResults from "../components/ManageAutoResults"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { useGetAutoTestResultsQuery } from "../../../../services/autoEvaluationApi"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"

const AutoTestResultsPage = () => {
  const { contestId, roundId } = useParams()

  const [page, setPage] = useState(1)
  const pageSize = 10
  const [studentNameSearch, setStudentNameSearch] = useState("")
  const [teamNameSearch, setTeamNameSearch] = useState("")

  // Fetch round info
  const {
    data: round,
    isLoading: roundLoading,
    isError: roundError,
  } = useGetRoundByIdQuery(roundId)
  const {
    data: resultsData,
    isLoading: resultsLoading,
    isError: resultsError,
  } = useGetAutoTestResultsQuery({
    roundId,
    pageNumber: page,
    pageSize,
    studentNameSearch,
    teamNameSearch,
  })

  const results = resultsData?.data ?? []
  const pagination = resultsData?.additionalData ?? {}

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_AUTO_RESULTS(
    round?.contestName ?? "Contest",
    round?.name ?? "Round"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_AUTO_RESULTS(
    contestId,
    roundId
  )

  if (roundLoading || resultsLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (roundError || resultsError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="auto results" />
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
        <ManageAutoResults
          results={results}
          pagination={pagination}
          setPage={setPage}
          setTeamNameSearch={setTeamNameSearch}
          setStudentNameSearch={setStudentNameSearch}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default AutoTestResultsPage
