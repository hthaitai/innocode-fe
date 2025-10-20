import { useState, useEffect, useCallback } from "react"
import { contestService } from "../../services/mockService"
import { useProblems } from "./useProblems"

export const useRoundDetail = (contestId, roundId) => {
  const [round, setRound] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const {
    problems,
    fetchProblems,
    addProblem,
    updateProblem,
    deleteProblem,
    validateProblem,
    problemsLoading,
    problemsError,
  } = useProblems(contestId, roundId)

  const fetchRound = useCallback(async () => {
    if (!contestId || !roundId) return
    setLoading(true)
    setError(null)
    try {
      const contest = await contestService.getContestById(contestId)
      const r = contest.rounds.find((r) => r.round_id === roundId)
      if (!r) throw new Error("Round not found")
      setRound(r)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [contestId, roundId])

  useEffect(() => {
    fetchRound()
  }, [fetchRound])

  const updateRound = useCallback(
    async (data) => {
      setLoading(true)
      setError(null)
      try {
        const updated = await contestService.updateRound(
          contestId,
          roundId,
          data
        )
        setRound(updated)
        return updated
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [contestId, roundId]
  )

  const deleteRound = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await contestService.deleteRound(contestId, roundId)
      setRound(null)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [contestId, roundId])

  return {
    round,
    problems,
    loading: loading || problemsLoading,
    error: error || problemsError,
    fetchRound,
    updateRound,
    deleteRound,
    addProblem,
    updateProblem,
    deleteProblem,
    validateProblem,
    fetchProblems,
  }
}
