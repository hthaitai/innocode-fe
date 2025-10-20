import { useState, useEffect, useCallback } from "react"
import { contestService } from "../../services/mockService"

export const useProblemDetail = (contestId, roundId, problemId) => {
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // --- Fetch single problem ---
  const fetchProblem = useCallback(async () => {
    if (!contestId || !roundId || !problemId) return

    setLoading(true)
    setError(null)
    try {
      const contest = await contestService.getContestById(contestId)
      const round = contest.rounds.find((r) => r.round_id === roundId)
      if (!round) throw new Error("Round not found")

      const prob = round.problems.find((p) => p.problem_id === problemId)
      if (!prob) throw new Error("Problem not found")

      setProblem(prob)
    } catch (err) {
      console.error("Failed to fetch problem:", err)
      setError(err.message || "Failed to load problem")
    } finally {
      setLoading(false)
    }
  }, [contestId, roundId, problemId])

  useEffect(() => {
    fetchProblem()
  }, [fetchProblem])

  // --- Update problem ---
  const updateProblem = useCallback(
    async (data) => {
      if (!contestId || !roundId || !problemId)
        throw new Error("Missing contest, round, or problem ID")
      setLoading(true)
      setError(null)
      try {
        const updated = await contestService.updateProblem(
          contestId,
          roundId,
          problemId,
          data
        )
        setProblem(updated)
        return updated
      } catch (err) {
        console.error("Failed to update problem:", err)
        setError(err.message || "Failed to update problem")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [contestId, roundId, problemId]
  )

  // --- Delete problem ---
  const deleteProblem = useCallback(async () => {
    if (!contestId || !roundId || !problemId)
      throw new Error("Missing contest, round, or problem ID")
    setLoading(true)
    setError(null)
    try {
      await contestService.deleteProblem(contestId, roundId, problemId)
      setProblem(null)
    } catch (err) {
      console.error("Failed to delete problem:", err)
      setError(err.message || "Failed to delete problem")
      throw err
    } finally {
      setLoading(false)
    }
  }, [contestId, roundId, problemId])

  return {
    problem,
    loading,
    error,
    fetchProblem,
    updateProblem,
    deleteProblem,
  }
}