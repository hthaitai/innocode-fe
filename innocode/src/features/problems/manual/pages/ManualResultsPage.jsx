import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import ResultsTable from "../components/ResultsTable"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useFetchManualResultsQuery } from "../../../../services/manualProblemApi"

const ManualResultsPage = () => {
  const { contestId, roundId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const [search, setSearch] = useState({})

  // Fetch round details
  const { data: round, isLoading: loadingRound } = useGetRoundByIdQuery(roundId)

  // Fetch manual results using RTK Query
  const {
    data: resultsData,
    isLoading: resultsLoading,
    refetch,
  } = useFetchManualResultsQuery({
    roundId,
    search,
    pageNumber,
    pageSize: 10,
  })

  // Refetch when search changes
  useEffect(() => {
    setPageNumber(1)
    refetch()
  }, [search, refetch])

  // Breadcrumbs (safe defaults)
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_MANUAL_RESULTS(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round"
  )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MANUAL_RESULTS(
    round?.contestId,
    roundId
  )

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={loadingRound || resultsLoading}
    >
      <ResultsTable
        results={resultsData?.results || []}
        loading={loadingRound || resultsLoading}
        pagination={
          resultsData?.pagination || { pageNumber: 1, pageSize: 10, total: 0 }
        }
        onPageChange={(page) => setPageNumber(page)}
        search={search}
        setSearch={setSearch}
      />
    </PageContainer>
  )
}

export default ManualResultsPage
