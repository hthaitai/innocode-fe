import { useMemo, useCallback, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchOrganizerContests } from "@/features/contest/store/contestThunks"
import { mapRoundList } from "@/features/round/mappers/roundMapper"

/**
 * Hook to manage rounds data for a specific organizer contest.
 */
export const useOrganizerContestRounds = (contestId) => {
  const dispatch = useAppDispatch()

  const {
    contests,
    pagination,
    listLoading: loading,
    listError: error,
  } = useAppSelector((state) => state.contests)

  // ✅ Find contest from store
  const contest = useMemo(
    () => contests.find((c) => String(c.contestId) === String(contestId)),
    [contests, contestId]
  )

  // ✅ Fetch contests if not found in store
  useEffect(() => {
    if (!contest && !loading) {
      dispatch(fetchOrganizerContests({ pageNumber: 1, pageSize: 50 }))
    }
  }, [contest, loading, dispatch])

  // ✅ Map rounds safely
  const rounds = useMemo(() => {
    if (!contest?.rounds) return []
    return mapRoundList(contest.rounds)
  }, [contest?.rounds])

  // ✅ Refetch only current contest list page
  const refetch = useCallback(() => {
    const currentPage = pagination?.pageNumber || 1
    const safePage = Math.min(currentPage, pagination?.totalPages || 1)
    dispatch(fetchOrganizerContests({ pageNumber: safePage, pageSize: 50 }))
  }, [dispatch, pagination?.pageNumber, pagination?.totalPages])

  return {
    contest,
    rounds,
    loading,
    error,
    refetch,
  }
}
