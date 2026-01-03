import React, { useState, useMemo, useCallback } from "react"
import TableFluent from "@/shared/components/TableFluent"
import { useNavigate } from "react-router-dom"
import { Trophy } from "lucide-react"
import { getContestColumns } from "../../columns/getContestColumns"
import {
  useGetOrganizerContestsQuery,
  useDeleteContestMutation,
} from "../../../../services/contestApi"
import { useConfirmDelete } from "../../../../shared/hooks/useConfirmDelete"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import ContestsToolbar from "./ContestsToolbar"
import TablePagination from "../../../../shared/components/TablePagination"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { useTranslation } from "react-i18next"

const ManageContests = ({ contests, pagination, setPage, setSearchName }) => {
  const navigate = useNavigate()
  const { confirmDeleteEntity } = useConfirmDelete()
  const [deleteContest] = useDeleteContestMutation()
  const { t } = useTranslation("pages")

  // Handlers
  const handleSearch = (value) => {
    setPage(1)
    setSearchName(value)
  }

  const handleRowClick = (contest) => {
    navigate(`/organizer/contests/${contest.contestId}`)
  }

  const handleEditContest = (contest) => {
    navigate(`/organizer/contests/${contest.contestId}/edit`)
  }

  const handleDeleteContest = (contest) => {
    confirmDeleteEntity({
      entityName: "Contest",
      item: { id: contest.contestId, name: contest.name },
      deleteAction: deleteContest,
      idKey: "id",
      onNavigate: () => {
        const count = contests.length
        if (count === 1 && page > 1) {
          setPage(page - 1)
        }
      },
    })
  }

  /** Table columns */
  const columns = getContestColumns(handleEditContest, handleDeleteContest, t)

  return (
    <div>
      <ContestsToolbar onSearch={handleSearch} />

      <TableFluent
        data={contests}
        columns={columns}
        onRowClick={handleRowClick}
      />

      <TablePagination pagination={pagination} onPageChange={setPage} />
    </div>
  )
}

export default ManageContests
