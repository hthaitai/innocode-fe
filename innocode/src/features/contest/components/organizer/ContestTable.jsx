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
import ContestTableActions from "./ContestTableActions"

const ContestTable = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { confirmDeleteEntity } = useConfirmDelete()

  /** Fetch contests via RTK Query */
  const {
    data: contestsData,
    isLoading,
    isError,
  } = useGetOrganizerContestsQuery({ pageNumber: page, pageSize })

  const contests = contestsData?.data || []
  const pagination = contestsData?.additionalData || {}

  /** Delete contest */
  const [deleteContest] = useDeleteContestMutation()

  const handleDeleteContest = useCallback(
    (contest) => {
      confirmDeleteEntity({
        entityName: "Contest",
        item: { id: contest.contestId, name: contest.name },
        deleteAction: deleteContest,
        idKey: "id",
        onNavigate: () => {
          // Optional: if deleting last item on page, go back one page
          if (contests.length === 1 && page > 1) setPage(page - 1)
        },
      })
    },
    [confirmDeleteEntity, deleteContest, contests.length, page]
  )

  /** Row click → navigate to contest details */
  const handleRowClick = useCallback(
    (contest) => navigate(`/organizer/contests/${contest?.contestId}`),
    [navigate]
  )

  /** Edit click → navigate to edit page */
  const handleEditContest = useCallback(
    (contest) => navigate(`/organizer/contests/${contest.contestId}/edit`),
    [navigate]
  )

  /** Add click → navigate to add page */
  const handleAddContest = useCallback(
    () => navigate("/organizer/contests/add"),
    [navigate]
  )

  /** Table columns */
  const columns = useMemo(
    () => getContestColumns(handleEditContest, handleDeleteContest),
    [handleEditContest, handleDeleteContest]
  )

  return (
    <div className="space-y-1">
      {isLoading && !contestsData ? (
        <div className="min-h-[70px] flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <TableFluent
          data={contests}
          columns={columns}
          loading={isLoading}
          error={isError}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          renderActions={() => <ContestTableActions />}
        />
      )}
    </div>
  )
}

export default ContestTable
