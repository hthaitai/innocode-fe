import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { useFetchManualResultsQuery } from "@/services/manualProblemApi"
import ResultsTable from "../../components/ResultsTable"

const JudgeManualResultsPage = () => {
  const { submissionId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const [search, setSearch] = useState({})

  // Fetch manual results for this submission
  const {
    data: resultsData,
    isLoading: resultsLoading,
    refetch,
  } = useFetchManualResultsQuery({
    submissionId,
    search,
    pageNumber,
    pageSize: 10,
  })

  // Reset pageNumber when search changes
  useEffect(() => {
    setPageNumber(1)
    refetch()
  }, [search, refetch])

  return (
    <PageContainer
      breadcrumb={["Submissions", "Manual Results"]}
      breadcrumbPaths={[
        "/submissions",
        `/submissions/${submissionId}/manual-results`,
      ]}
      loading={resultsLoading}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Manual Results</h1>
        <p className="mb-6">
          Results for submission ID: <strong>{submissionId}</strong>
        </p>

        <ResultsTable
          results={resultsData?.results || []}
          loading={resultsLoading}
          pagination={
            resultsData?.pagination || { pageNumber: 1, pageSize: 10, total: 0 }
          }
          onPageChange={(page) => setPageNumber(page)}
          search={search}
          setSearch={setSearch}
        />
      </div>
    </PageContainer>
  )
}

export default JudgeManualResultsPage
