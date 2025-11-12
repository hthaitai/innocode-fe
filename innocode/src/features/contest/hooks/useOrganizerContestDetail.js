import { useState, useCallback } from "react"
import { useAppDispatch } from "@/store/hooks"
import {
  deleteContest,
} from "@/features/contest/store/contestThunks"
import { useConfirmDelete } from "@/shared/hooks/useConfirmDelete"
import { contestService } from "@/features/contest/services/contestService"
import { mapContestFromAPI } from "@/shared/utils/contestMapper"
import { useModal } from "@/shared/hooks/useModal"

export const useOrganizerContestDetail = () => {
  const { confirmDeleteEntity } = useConfirmDelete()
  const { openModal } = useModal()

  const [contest, setContest] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch contest detail
  const fetchContestDetail = useCallback(async (contestId) => {
    if (!contestId) {
      setError("Contest ID is required")
      return
    }
    try {
      setLoading(true)
      setError(null)
      const data = await contestService.getContestById(contestId)
      setContest(data ? mapContestFromAPI(data) : null)
    } catch (err) {
      console.error("❌ Error fetching contest detail:", err)
      setError(err.message || "Failed to load contest details")
    } finally {
      setLoading(false)
    }
  }, [])

  // Safe refetch helper — consistent with list hook
  const refetchContestDetail = useCallback(() => {
    if (contest?.contestId) fetchContestDetail(contest.contestId)
  }, [contest?.contestId, fetchContestDetail])

  // Handle edit via modal
  const handleEdit = useCallback(
    (contest) => {
      openModal("contest", {
        initialData: contest,
        onUpdated: refetchContestDetail,
      })
    },
    [openModal, refetchContestDetail]
  )

  // Handle delete (confirm + thunk)
  const handleDelete = useCallback(
    (item) => {
      confirmDeleteEntity({
        entityName: "contest",
        item,
        deleteAction: deleteContest,
        idKey: "contestId",
        onSuccess: item?.onSuccess || refetchContestDetail,
      })
    },
    [confirmDeleteEntity, refetchContestDetail]
  )

  return {
    contest,
    loading,
    error,
    fetchContestDetail,
    handleEdit,
    handleDelete,
  }
}
