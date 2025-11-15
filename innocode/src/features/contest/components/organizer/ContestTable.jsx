import React, { useState, useEffect, useCallback, useMemo } from "react"
import TableFluent from "@/shared/components/TableFluent"
import { useModal } from "@/shared/hooks/useModal"
import toast from "react-hot-toast"
import {
  fetchOrganizerContests,
  deleteContest,
} from "@/features/contest/store/contestThunks"
import { getContestColumns } from "../../columns/getContestColumns"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../../store/hooks"
import { Trophy } from "lucide-react"

const ContestTable = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { openModal } = useModal()

  const { contests, pagination, listLoading, error } = useAppSelector(
    (s) => s.contests
  )

  const [page, setPage] = useState(1)
  const pageSize = 10

  /** Fetch contests */
  const fetchContests = useCallback(() => {
    dispatch(fetchOrganizerContests({ pageNumber: page, pageSize }))
  }, [dispatch, page, pageSize])

  useEffect(() => {
    fetchContests()
  }, [fetchContests])

  /** Safe refetch */
  const refetchContests = useCallback(() => {
    const safePage = Math.min(page, pagination?.totalPages || 1)
    dispatch(fetchOrganizerContests({ pageNumber: safePage, pageSize }))
  }, [dispatch, page, pageSize, pagination?.totalPages])

  /** Add → open modal */
  const handleAddContest = useCallback(() => {
    openModal("contest", {
      onCreated: () => {
        setPage(1)
        dispatch(fetchOrganizerContests({ pageNumber: 1, pageSize }))
      },
    })
  }, [openModal, dispatch, pageSize, setPage])

  /** Edit */
  const handleEditContest = useCallback(
    (contest) => {
      openModal("contest", { initialData: contest, onUpdated: refetchContests })
    },
    [openModal, refetchContests]
  )

  /** Delete */
  const handleDeleteContest = useCallback(
    (contest) => {
      openModal("confirmDelete", {
        message: `Are you sure you want to delete "${contest.name}"?`,
        onConfirm: async (onClose) => {
          try {
            await dispatch(
              deleteContest({ contestId: contest.contestId })
            ).unwrap()
            toast.success("Contest deleted successfully!")
            refetchContests()
          } catch {
            toast.error("Failed to delete contest.")
          } finally {
            onClose()
          }
        },
      })
    },
    [dispatch, openModal, refetchContests]
  )

  /** Row click → navigate to contest details */
  const handleRowClick = useCallback(
    (contest) => navigate(`/organizer/contests/${contest?.contestId}`),
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
          Add Contest
        </button>
      </div>

      {/* Table */}
      <TableFluent
        data={contests}
        columns={columns}
        loading={listLoading}
        error={error}
        pagination={pagination}
        onPageChange={setPage}
        onRowClick={handleRowClick}
      />
    </div>
  )
}

export default ContestTable
