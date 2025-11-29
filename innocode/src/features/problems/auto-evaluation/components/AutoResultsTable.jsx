import React, { useState } from "react"
import { useParams } from "react-router-dom"
import TableFluent from "@/shared/components/TableFluent"
import getAutoResultColumns from "../columns/getAutoResultColumns"
import { useGetAutoTestResultsQuery } from "../../../../services/autoEvaluationApi"

const AutoResultsTable = () => {
  const { roundId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10

  const { data: resultsData, isLoading } = useGetAutoTestResultsQuery(
    { roundId, pageNumber, pageSize },
    { skip: !roundId }
  )

  const autoResults = resultsData?.data || []
  const pagination = resultsData?.additionalData || {}

  const columns = getAutoResultColumns()

  const handlePageChange = (newPage) => {
    setPageNumber(newPage)
  }

  return (
    <TableFluent
      data={autoResults}
      columns={columns}
      loading={isLoading}
      pagination={pagination}
      onPageChange={handlePageChange}
    />
  )
}

export default AutoResultsTable
