import { useEffect, useMemo, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useModal } from "../../../shared/hooks/useModal"
import { toast } from "react-hot-toast"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useGetRoundsByContestIdQuery, useDeleteRoundMutation } from "@/services/roundApi"

export const useOrganizerRoundDetail = (contestId, roundId) => {
  const navigate = useNavigate()
  const { openModal } = useModal()

  // Fetch contest info and rounds via RTK Query
  const {
    data: contestData,
    isLoading: contestLoading,
    isError: contestError,
    refetch: refetchContest,
  } = useGetContestByIdQuery(contestId)

  const {
    data: roundsData,
    isLoading: roundsLoading,
    isError: roundsError,
    refetch: refetchRounds,
  } = useGetRoundsByContestIdQuery(contestId)

  const [deleteRound, { isLoading: deleting }] = useDeleteRoundMutation()

  const contest = contestData?.data?.[0] ?? null

  // roundsData expected shape: { data: [...] }
  const roundsList = roundsData?.data || []
  const round = roundsList.find((r) => String(r.roundId) === String(roundId)) ||
    null

  const loading = contestLoading || roundsLoading
  const error = contestError || roundsError

  const refetchRoundDetail = useCallback(() => {
    refetchContest()
    refetchRounds()
  }, [refetchContest, refetchRounds])

  const handleEdit = useCallback(() => {
    if (!round) return
    navigate(`/organizer/contests/${contestId}/rounds/${round.roundId}/edit`)
  }, [round, navigate, contestId])

  const handleDelete = useCallback(() => {
    if (!round) return
    openModal("confirmDelete", {
      message: `Are you sure you want to delete "${round.name}"?`,
      onConfirm: async (onClose) => {
        try {
          await deleteRound(round.roundId).unwrap()
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
  }, [openModal, deleteRound, navigate, contestId, round])

  return {
    contest,
    round,
    loading,
    error,
    refetchRoundDetail,
    handleEdit,
    handleDelete,
    deleting,
  }
}
