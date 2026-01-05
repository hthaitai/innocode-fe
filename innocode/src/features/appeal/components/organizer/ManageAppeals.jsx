import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation(["appeal"])
  const navigate = useNavigate()
  const appealsColumns = getAppealsColumns(t)

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

      {appeals.length > 0 && (
        <TablePagination pagination={pagination} onPageChange={setPageNumber} />
      )}
    </div>
  )
}

export default ManageAppeals
