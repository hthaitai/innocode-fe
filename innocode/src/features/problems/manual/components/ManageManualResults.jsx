import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import TableFluent from "@/shared/components/TableFluent"
import { getResultColumns } from "../columns/getResultColumns"
import { useFetchOrganizerManualResultsQuery } from "@/services/manualProblemApi"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import TablePagination from "../../../../shared/components/TablePagination"
import ManualResultsToolbar from "./ManualResultsToolbar"

const ManageManualResults = ({
  results,
  pagination,
  onPageChange,
  setStudentNameSearch,
  setTeamNameSearch,
}) => {
  const { roundId, contestId } = useParams()
  const navigate = useNavigate()

  const handleSearch = ({ studentName, teamName }) => {
    if (onPageChange) onPageChange(1)
    setStudentNameSearch(studentName || "")
    setTeamNameSearch(teamName || "")
  }

  const handleRowClick = (row) => {
    const submissionId = row.submissionId
    if (submissionId) {
      navigate(
        `/organizer/contests/${contestId}/rounds/${roundId}/manual-test/results/${submissionId}`
      )
    }
  }

  const columns = getResultColumns()

  return (
    <div>
      <ManualResultsToolbar onSearch={handleSearch} />

      <TableFluent data={results} columns={columns} onRowClick={handleRowClick} />

      <TablePagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  )
}

export default ManageManualResults
