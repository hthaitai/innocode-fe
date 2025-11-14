import { useEffect, useMemo, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchOrganizerContests } from "@/features/contest/store/contestThunks"
import { mapRoundList } from "../mappers/roundMapper"
import { deleteRound } from "../store/roundThunk"
import { useModal } from "../../../shared/hooks/useModal"
import { toast } from "react-hot-toast"

export const useOrganizerRoundDetail = (contestId, roundId) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { openModal } = useModal()

  const { contests, pagination, loading, error } = useAppSelector(
    (state) => state.contests
  )

  const [contest, setContest] = useState(null)
  const [round, setRound] = useState(null)

  /* Fetch round detail (Redux-based like before) */
  const fetchRoundDetail = useCallback(() => {
    const foundContest = contests?.find(
      (c) => String(c.contestId) === String(contestId)
    )

    if (!foundContest) {
      if (!loading) {
        dispatch(fetchOrganizerContests({ pageNumber: 1, pageSize: 50 }))
      }
      return
    }

    const mappedRound = mapRoundList(foundContest.rounds || []).find(
      (r) => String(r.roundId) === String(roundId)
    )

    setContest(foundContest || null)
    setRound(mappedRound || null)
  }, [contests, contestId, roundId, dispatch, loading])

  useEffect(() => {
    fetchRoundDetail()
  }, [fetchRoundDetail])

  /* Refetch helper */
  const refetchRoundDetail = useCallback(() => {
    const current = pagination?.pageNumber || 1
    const safe = Math.min(current, pagination?.totalPages || 1)
    dispatch(fetchOrganizerContests({ pageNumber: safe, pageSize: 50 }))
  }, [dispatch, pagination?.pageNumber, pagination?.totalPages])

  /* Handle edit (modal-based like contest) */
  const handleEdit = useCallback(() => {
    if (!round) return
    openModal("round", {
      initialData: round,
      onUpdated: refetchRoundDetail,
    })
  }, [round, openModal, refetchRoundDetail])

  /* Handle delete */
  const handleDelete = useCallback(() => {
    if (!round) return
    openModal("confirmDelete", {
      message: `Are you sure you want to delete "${round.name}"?`,
      onConfirm: async (onClose) => {
        try {
          await dispatch(deleteRound({ roundId: round.roundId })).unwrap()
          toast.success("Round deleted successfully!")
          navigate(`/organizer/contests/${contestId}`)
        } catch (err) {
          console.error("❌ Failed to delete round:", err)
          toast.error("Failed to delete round.")
        } finally {
          onClose()
        }
      },
    })
  }, [dispatch, openModal, navigate, contestId, round])

  return {
    contest,
    round,
    loading,
    error,
    refetchRoundDetail,
    handleEdit,
    handleDelete,
  }
}
