import { useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { fetchContests } from "@/features/contest/store/contestThunks"
import { deleteRound as deleteRoundThunk } from "@/features/round/store/roundThunk"
import { useConfirmDelete } from "@/shared/hooks/useConfirmDelete"
import { mapRoundList } from "../mappers/roundMapper"

export const useOrganizerRound = (contestId, roundId) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { confirmDeleteEntity } = useConfirmDelete()

  const { contests, pagination, loading, error } = useAppSelector(
    (state) => state.contests
  )

  const contest = useMemo(
    () => contests?.find((c) => String(c.contestId) === String(contestId)),
    [contests, contestId]
  )

  const round = useMemo(() => {
    if (!contest?.rounds) return null
    return mapRoundList(contest.rounds).find(
      (r) => String(r.roundId) === String(roundId)
    )
  }, [contest?.rounds, roundId])

  useEffect(() => {
    if (!contest && !loading) {
      dispatch(fetchContests({ pageNumber: 1, pageSize: 50 }))
    }
  }, [contest, loading, dispatch])

  const refetch = useCallback(() => {
    const current = pagination?.pageNumber || 1
    const safe = Math.min(current, pagination?.totalPages || 1)
    dispatch(fetchContests({ pageNumber: safe, pageSize: 50 }))
  }, [dispatch, pagination?.pageNumber, pagination?.totalPages])

  const handleDelete = useCallback(() => {
    if (!round) return
    confirmDeleteEntity({
      entityName: "Round",
      item: round,
      deleteAction: deleteRoundThunk,
      idKey: "roundId",
      onSuccess: refetch,
      onNavigate: () => navigate(`/organizer/contests/${contestId}`),
    })
  }, [round, confirmDeleteEntity, refetch, navigate, contestId])

  return { contest, round, loading, error, refetch, handleDelete }
}
