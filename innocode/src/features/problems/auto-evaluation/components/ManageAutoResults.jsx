import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import TableFluent from "@/shared/components/TableFluent"
import getAutoResultColumns from "../columns/getAutoResultColumns"
import { useGetAutoTestResultsQuery } from "../../../../services/autoEvaluationApi"
import AutoResultExpandedRow from "./AutoResultExpandedRow"
import TablePagination from "../../../../shared/components/TablePagination"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import AutoResultsToolbar from "./AutoResultsToolbar"

const ManageAutoResults = () => {
  const { roundId, contestId } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [studentNameSearch, setStudentNameSearch] = useState("")
  const [teamNameSearch, setTeamNameSearch] = useState("")

  const {
    data: resultsData,
    isLoading,
    isError,
  } = useGetAutoTestResultsQuery({
    roundId,
    pageNumber: page,
    pageSize,
    studentNameSearch,
    teamNameSearch,
  })

  const handleSearch = ({ studentName, teamName }) => {
    setPage(1) // reset page
    setStudentNameSearch(studentName || "")
    setTeamNameSearch(teamName || "")
  }

  const autoResults = resultsData?.data ?? []
  const pagination = resultsData?.additionalData ?? {}

  const handleRowClick = (submissionId) => {
    navigate(
      `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation/results/${submissionId}`
    )
  }

  const columns = getAutoResultColumns()

  if (isLoading) {
    return (
      <div className="min-h-[70px] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-red-600 text-sm leading-5 border border-red-200 rounded-[5px] bg-red-50 flex items-center px-5 min-h-[70px]">
        Something went wrong while loading results. Please try again.
      </div>
    )
  }

  return (
    <AnimatedSection>
      <AutoResultsToolbar onSearch={handleSearch} />

      <TableFluent
        data={autoResults}
        columns={columns}
        onRowClick={handleRowClick}
      />

      <TablePagination pagination={pagination} onPageChange={setPage} />
    </AnimatedSection>
  )
}

export default ManageAutoResults
