import React, { useState, useEffect } from "react"
import TableFluent from "@/shared/components/TableFluent"
import { getResultColumns } from "../columns/getResultColumns"
import { useFetchOrganizerManualResultsQuery } from "@/services/manualProblemApi"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import TablePagination from "../../../../shared/components/TablePagination"
import ManualResultsToolbar from "./ManualResultsToolbar"

const ManageManualResults = ({ roundId }) => {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [studentNameSearch, setStudentNameSearch] = useState("")
  const [teamNameSearch, setTeamNameSearch] = useState("")

  // Fetch manual results using RTK Query
  const {
    data: resultsData,
    isLoading,
    isError,
  } = useFetchOrganizerManualResultsQuery({
    roundId,
    pageNumber: page,
    pageSize,
    studentNameSearch,
    teamNameSearch,
  })

  const results = resultsData?.data ?? []
  const pagination = resultsData?.additionalData

  const handleSearch = ({ studentName, teamName }) => {
    setPage(1) // reset page
    setStudentNameSearch(studentName || "")
    setTeamNameSearch(teamName || "")
  }

  const columns = getResultColumns()

  const renderSubComponent = (submission) => (
    <div className="overflow-x-auto">
      <table className="table-fixed w-full border-b border-t border-[#E5E5E5] border-collapse">
        <thead>
          <tr>
            {["Criterion", "Score", "Max", "Note"].map((header) => (
              <th
                key={header}
                className="p-2 px-5 text-[12px] leading-[16px] font-normal text-[#7A7574] border-b border-[#E5E5E5] text-left"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {submission.criterionResults.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="text-center text-[14px] leading-[20px] text-[#7A7574] py-4"
              >
                No criteria available.
              </td>
            </tr>
          ) : (
            submission.criterionResults.map((criterion, index) => (
              <tr
                key={index}
                className="group hover:bg-[#F6F6F6] transition-colors"
              >
                <td className="text-[14px] leading-[20px] border-[#E5E5E5] align-middle p-2 px-5 truncate">
                  {criterion.description}
                </td>
                <td className="text-[14px] leading-[20px] border-[#E5E5E5] align-middle p-2 px-5 truncate">
                  {criterion.score}
                </td>
                <td className="text-[14px] leading-[20px] border-[#E5E5E5] align-middle p-2 px-5 truncate">
                  {criterion.maxScore}
                </td>
                <td className="text-[14px] leading-[20px] border-[#E5E5E5] align-middle p-2 px-5 truncate">
                  {criterion.note || "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-[70px] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <AnimatedSection>
      <ManualResultsToolbar onSearch={handleSearch} />

      <TableFluent
        data={results}
        columns={columns}
        error={isError}
        renderSubComponent={renderSubComponent}
      />

      <TablePagination pagination={pagination} onPageChange={setPage} />
    </AnimatedSection>
  )
}

export default ManageManualResults
