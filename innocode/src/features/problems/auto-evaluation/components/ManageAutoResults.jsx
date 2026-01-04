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
import { useTranslation } from "react-i18next"

const ManageAutoResults = ({
  results,
  pagination,
  setPage,
  setTeamNameSearch,
  setStudentNameSearch,
}) => {
  const { t } = useTranslation("common")
  const { roundId, contestId } = useParams()
  const navigate = useNavigate()

  const handleSearch = ({ studentName, teamName }) => {
    setPage(1) // reset page
    setStudentNameSearch(studentName || "")
    setTeamNameSearch(teamName || "")
  }

  const handleRowClick = (row) => {
    const submissionId = row.submissionId
    if (submissionId) {
      navigate(
        `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation/results/${submissionId}`
      )
    }
  }

  const columns = getAutoResultColumns(t)

  return (
    <div>
      <AutoResultsToolbar onSearch={handleSearch} />

      <TableFluent
        data={results}
        columns={columns}
        onRowClick={handleRowClick}
      />

      <TablePagination pagination={pagination} onPageChange={setPage} />
    </div>
  )
}

export default ManageAutoResults
