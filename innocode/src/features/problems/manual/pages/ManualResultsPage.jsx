import React, { useState } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import ManageManualResults from "../components/ManageManualResults"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { useFetchOrganizerManualResultsQuery } from "../../../../services/manualProblemApi"

const ManualResultsPage = () => {
  const { contestId, roundId } = useParams()

  const [page, setPage] = useState(1)
  const pageSize = 10
  const [studentNameSearch, setStudentNameSearch] = useState("")
  const [teamNameSearch, setTeamNameSearch] = useState("")

  // Fetch round details
  const {
    data: round,
    isLoading: roundLoading,
    isError: roundError,
  } = useGetRoundByIdQuery(roundId)
  const {
    data: resultsData,
    isLoading: resultsLoading,
    isError: resultsError,
  } = useFetchOrganizerManualResultsQuery({
    roundId,
    pageNumber: page,
    pageSize,
    studentNameSearch,
    teamNameSearch,
  })

  const results = resultsData?.data ?? []
  const pagination = resultsData?.additionalData ?? {}

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_MANUAL_RESULTS(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MANUAL_RESULTS(
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
        <ErrorState itemName="manual results" />
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
