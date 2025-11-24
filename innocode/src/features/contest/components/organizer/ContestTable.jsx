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
      {/* Header w/ Add Button */}
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
        <div className="flex gap-5 items-center">
          <Trophy size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">Contests</p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              Manage all contests you created
            </p>
          </div>
        </div>

        <button className="button-orange" onClick={handleAddContest}>
          Add contest
        </button>
      </div>

      {/* Table */}
      <TableFluent
        data={contests}
        columns={columns}
        loading={isLoading}
        error={isError}
        pagination={pagination}
        onPageChange={setPage}
        onRowClick={handleRowClick}
      />
    </div>
  )
}

export default ContestTable
