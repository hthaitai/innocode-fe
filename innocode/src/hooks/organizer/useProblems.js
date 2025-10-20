import { useState, useEffect, useCallback } from "react"
import { contestService } from "../../services/mockService"

export const useProblems = (contestId, roundId) => {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProblems = useCallback(async () => {
    if (!contestId || !roundId) return
    setLoading(true)
    setError(null)
    try {
      const contest = await contestService.getContestById(contestId)
      const round = contest.rounds.find((r) => r.round_id === roundId)
      if (!round) throw new Error("Round not found")
      setProblems(round.problems || [])
    } catch (err) {
      console.error("Failed to fetch problems:", err)
      setError(err.message || "Failed to load problems")
    } finally {
      setLoading(false)
    }
  }, [contestId, roundId])

  useEffect(() => {
    fetchProblems()
  }, [fetchProblems])

  const validateProblem = useCallback((data) => {
    const errors = {}
    if (!data.title?.trim()) errors.title = "Title is required"
    if (!data.language?.trim()) errors.language = "Language is required"
    if (!data.type?.trim()) errors.type = "Type is required"
    if (data.penalty_rate != null && isNaN(data.penalty_rate))
      errors.penalty_rate = "Penalty rate must be a number"
    return errors
  }, [])

  const addProblem = useCallback(
    async (data) => {
      if (!contestId || !roundId) throw new Error("Missing contest or round ID")
      setLoading(true)
      setError(null)
      try {
        const newProblem = await contestService.addProblem(
          contestId,
          roundId,
          data
        )
        setProblems((prev) => [...prev, newProblem])
        return newProblem
      } catch (err) {
        console.error("Failed to add problem:", err)
        setError(err.message || "Failed to add problem")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [contestId, roundId]
  )

  const updateProblem = useCallback(
    async (problemId, data) => {
      if (!contestId || !roundId) throw new Error("Missing contest or round ID")
      setLoading(true)
      setError(null)
      try {
        const updated = await contestService.updateProblem(
          contestId,
          roundId,
          problemId,
          data
        )
        setProblems((prev) =>
          prev.map((p) => (p.problem_id === problemId ? updated : p))
        )
        return updated
      } catch (err) {
        console.error("Failed to update problem:", err)
        setError(err.message || "Failed to update problem")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [contestId, roundId]
  )

  const deleteProblem = useCallback(
    async (problemId) => {
      if (!contestId || !roundId) throw new Error("Missing contest or round ID")
      setLoading(true)
      setError(null)
      try {
        await contestService.deleteProblem(contestId, roundId, problemId)
        setProblems((prev) => prev.filter((p) => p.problem_id !== problemId))
      } catch (err) {
        console.error("Failed to delete problem:", err)
        setError(err.message || "Failed to delete problem")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [contestId, roundId]
  )

  return {
    problems,
    loading,
    error,
    fetchProblems,
    validateProblem,
    addProblem,
    updateProblem,
    deleteProblem,
  }
}
