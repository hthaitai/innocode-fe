import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetPlagiarismQueueQuery } from "@/services/plagiarismApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { getPlagiarismColumns } from "../../columns/getPlagiarismColumns"

export default function OrganizerPlagiarismQueue() {
  const navigate = useNavigate()
  const { contestId } = useParams()
  const [page, setPage] = useState(1)
  const pageSize = 20

  // Fetch contest info
  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
  } = useGetContestByIdQuery(contestId)

  const contestName = contest?.name || "Contest"
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_PLAGIARISM(contestName)
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_PLAGIARISM(contestId)

  // Fetch plagiarism queue
  const {
    data: plagiarismData,
    isLoading: plagiarismLoading,
    isError: plagiarismError,
  } = useGetPlagiarismQueueQuery({ pageNumber: page, pageSize })

  const plagiarismItems = plagiarismData?.data ?? []
  const pagination = plagiarismData?.additionalData

  const handleRowClick = (item) => {
    navigate(`/organizer/contests/${contestId}/plagiarism/${item.submissionId}`)
  }

  const plagiarismColumns = getPlagiarismColumns()

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={plagiarismLoading || contestLoading}
      error={plagiarismError || contestError}
    >
      <TableFluent
        data={plagiarismItems}
        columns={plagiarismColumns}
        onRowClick={handleRowClick}
        loading={plagiarismLoading}
        error={plagiarismError}
        pagination={pagination}
        onPageChange={setPage}
      />
    </PageContainer>
  )
}

