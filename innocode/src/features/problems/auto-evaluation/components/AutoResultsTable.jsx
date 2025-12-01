import React, { useState } from "react"
import { useParams } from "react-router-dom"
import TableFluent from "@/shared/components/TableFluent"
import getAutoResultColumns from "../columns/getAutoResultColumns"
import { useGetAutoTestResultsQuery } from "../../../../services/autoEvaluationApi"

const AutoResultsTable = () => {
  const { roundId } = useParams()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: resultsData, isLoading } = useGetAutoTestResultsQuery(
    { roundId, pageNumber: page, pageSize },
    { skip: !roundId }
  )

  const autoResults = resultsData?.data || []
  const pagination = resultsData?.additionalData || {}

  const columns = getAutoResultColumns()

  return (
    <TableFluent
      data={autoResults}
      columns={columns}
      loading={isLoading}
      pagination={pagination}
      onPageChange={setPage}
      renderActions={() => (
        <div className="min-h-[70px] px-5 flex items-center">
          <p className="text-[14px] leading-[20px] font-medium">
            Results
          </p>
        </div>
      )}
    />
  )
}

export default AutoResultsTable
