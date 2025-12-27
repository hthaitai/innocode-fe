import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import TableFluent from "@/shared/components/TableFluent"
import OrganizerAppealsToolbar from "../../components/organizer/OrganizerAppealsToolbar"
import TablePagination from "../../../../shared/components/TablePagination"
import { getAppealsColumns } from "../../columns/getAppealsColumns"

const ManageAppeals = ({
  contestId,
  appeals,
  pagination,
  setPageNumber,
  decisionFilter,
  setDecisionFilter,
}) => {
  const navigate = useNavigate()
  const appealsColumns = getAppealsColumns()

  // Reset page when filter changes
  useEffect(() => {
    setPageNumber(1)
  }, [decisionFilter])

  const handleRowClick = (appeal) => {
    navigate(`/organizer/contests/${contestId}/appeals/${appeal.appealId}`)
  }

  return (
    <div>
      <OrganizerAppealsToolbar
        decisionFilter={decisionFilter}
        setDecisionFilter={setDecisionFilter}
      />

      <TableFluent
        data={appeals}
        columns={appealsColumns}
        onRowClick={handleRowClick}
      />

      <TablePagination pagination={pagination} onPageChange={setPageNumber} />
    </div>
  )
}

export default ManageAppeals
