import { useState, useCallback, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchOrganizerContests,
  deleteContest,
} from "@/features/contest/store/contestThunks"
import { useModal } from "@/shared/hooks/useModal"
import toast from "react-hot-toast"

export const useOrganizerContestList = (pageSize = 10) => {
  const dispatch = useAppDispatch()
  const {
    contests,
    pagination,
    listLoading: loading,
    error,
  } = useAppSelector((state) => state.contests)
  const [page, setPage] = useState(1)
  const { openModal } = useModal()

  // --- Fetch contests ---
  const fetchContests = useCallback(() => {
    dispatch(fetchOrganizerContests({ pageNumber: page, pageSize }))
  }, [dispatch, page, pageSize])

  // --- Refetch helper (safe for pagination) ---
  const refetchContests = useCallback(() => {
    const safePage = Math.min(page, pagination?.totalPages || 1)
    dispatch(fetchOrganizerContests({ pageNumber: safePage, pageSize }))
  }, [dispatch, page, pageSize, pagination?.totalPages])

  // --- Add contest handler ---
  const handleAdd = useCallback(() => {
    openModal("contest", {
      onCreated: refetchContests,
    })
  }, [openModal, refetchContests])

  // --- Edit handler ---
  const handleEdit = useCallback(
    (contest) => {
      openModal("contest", {
        initialData: contest,
        onUpdated: refetchContests,
      })
    },
    [openModal, refetchContests]
  )

  // --- Delete handler ---
  const handleDelete = useCallback(
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

  return {
    contests,
    pagination,
    loading,
    error,
    page,
    setPage,
    fetchContests,
    refetchContests,
    handleAdd,
    handleEdit,
    handleDelete,
  }
}
