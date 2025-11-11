import { useState, useEffect, useCallback } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import {
  fetchContests,
  deleteContest,
  updateContest,
} from "@/features/contest/store/contestThunks"
import { useConfirmDelete } from "@/shared/hooks/useConfirmDelete"
import { contestService } from "@/features/contest/services/contestService"
import { mapContestFromAPI } from "@/shared/utils/contestMapper"

/**
 * useOrganizerContest
 *
 * Unified hook for managing both contest list and contest detail logic
 * within the Organizer context.
 *
 * Provides:
 *  - Contest list (with pagination)
 *  - Contest detail (fetch single)
 *  - CRUD operations (delete, edit)
 *  - Automatic refresh capabilities
 */
export const useOrganizerContest = (pageSize = 10) => {
  const dispatch = useAppDispatch()
  const { confirmDeleteEntity } = useConfirmDelete()

  // --- Redux contest list state ---
  const { contests, pagination, loading, error } = useAppSelector(
    (state) => state.contests
  )

  const [page, setPage] = useState(1)

  // --- Local state for single contest ---
  const [contest, setContest] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)

  // === LIST LOGIC ===
  useEffect(() => {
    dispatch(fetchContests({ pageNumber: page, pageSize }))
  }, [dispatch, page, pageSize])

  const refetchContests = useCallback(() => {
    const safePage = Math.min(page, pagination?.totalPages || 1)
    dispatch(fetchContests({ pageNumber: safePage, pageSize }))
  }, [dispatch, page, pageSize, pagination?.totalPages])

  const handleDelete = useCallback(
    (item) => {
      confirmDeleteEntity({
        entityName: "contest",
        item,
        deleteAction: deleteContest,
        idKey: "contestId",
        onSuccess: item?.onSuccess || refetchContests,
      })
    },
    [confirmDeleteEntity, refetchContests]
  )

  // === DETAIL LOGIC ===
  const fetchContestDetail = useCallback(async (contestId) => {
    if (!contestId) {
      setDetailError("Contest ID is required")
      return
    }

    try {
      setDetailLoading(true)
      setDetailError(null)

      const data = await contestService.getContestById(contestId)
      const mappedContest = data ? mapContestFromAPI(data) : null
      setContest(mappedContest)
    } catch (error) {
      console.error("❌ Error fetching contest detail:", error)
      setDetailError(error.message || "Failed to load contest details")
    } finally {
      setDetailLoading(false)
    }
  }, [])

  const handleEdit = useCallback(
    async (id, updatedData) => {
      try {
        await dispatch(updateContest({ id, data: updatedData })).unwrap()
        await fetchContestDetail(id) // refresh detail view
        refetchContests() // refresh list view
      } catch (error) {
        console.error("❌ Error updating contest:", error)
      }
    },
    [dispatch, fetchContestDetail, refetchContests]
  )

  return {
    // --- List state ---
    contests,
    pagination,
    page,
    setPage,
    loading,
    error,
    refetchContests,

    // --- Detail state ---
    contest,
    fetchContestDetail,
    detailLoading,
    detailError,
    handleEdit,

    // --- Shared actions ---
    handleDelete,
  }
}

export default useOrganizerContest
