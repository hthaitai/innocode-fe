import { useState, useCallback, useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"
import { deleteContest } from "@/features/contest/store/contestThunks"
import { contestService } from "@/features/contest/services/contestService"
import { mapContestFromAPI } from "@/shared/utils/contestMapper"
import { useModal } from "@/shared/hooks/useModal"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { fetchContestById } from "../store/contestThunks"
import { useAppSelector } from "../../../store/hooks"

export const useOrganizerContestDetail = (contestId) => {
  const dispatch = useAppDispatch()
  const { openModal } = useModal()
  const navigate = useNavigate()

  const {
    contest,
    detailLoading: loading,
    error,
  } = useAppSelector((state) => state.contests)

  // Fetch contest detail
  useEffect(() => {
    if (!contestId) return
    if (!contest || contest.contestId !== contestId) {
      dispatch(fetchContestById(contestId))
    }
  }, [dispatch, contestId, contest?.contestId])

  // Handle edit via modal
  const handleEdit = useCallback(() => {
    if (!contest) return
    openModal("contest", {
      initialData: contest,
      onUpdated: () => {
        // refetch on update if necessary
        dispatch(fetchContestById(contest.contestId))
      },
    })
  }, [contest, openModal, dispatch])

  // Handle delete (confirm modal + thunk + toast + navigate)
  const handleDelete = useCallback(() => {
    if (!contest) return
    openModal("confirmDelete", {
      message: `Are you sure you want to delete "${contest.name}"?`,
      onConfirm: async (onClose) => {
        try {
          await dispatch(
            deleteContest({ contestId: contest.contestId })
          ).unwrap()
          toast.success("Contest deleted successfully!")
          navigate("/organizer/contests")
        } catch (err) {
          console.error("❌ Failed to delete contest:", err)
          toast.error("Failed to delete contest.")
        } finally {
          onClose()
        }
      },
    })
  }, [contest, dispatch, openModal, navigate])

  return {
    contest,
    loading,
    error,
    handleEdit,
    handleDelete,
  }
}
