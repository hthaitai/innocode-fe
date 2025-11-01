import { useState, useCallback } from "react"
import { problems as fakeData } from '@/data/contests/problems'

export const useProblems = (contestId, roundId) => {
  // ✅ Initialize from fakeData filtered by round_id
  const [problems, setProblems] = useState(() =>
    roundId ? fakeData.filter((p) => p.round_id === Number(roundId)) : fakeData
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // // ----- FETCH -----
  // useEffect(() => {
  //   const fetchProblems = async () => {
  //     if (!contestId || !roundId) return
  //     try {
  //       setLoading(true)
  //       setError(null)
  //       const contest = await contestService.getContestById(contestId)
  //       const round = contest.rounds.find((r) => r.round_id === roundId)
  //       setProblems(round?.problems || [])
  //     } catch (err) {
  //       console.error(err)
  //       setError(err.message || "Failed to load problems")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchProblems()
  // }, [contestId, roundId])

  // ----- CREATE -----
  const addProblem = useCallback(
    async (data) => {
      if (!roundId) throw new Error("Missing round ID")
      setLoading(true)
      setError(null)
      try {
        // const newProblem = await contestService.addProblem(contestId, roundId, data)
        const newProblem = {
          problem_id: Date.now(),
          created_at: new Date().toISOString(),
          round_id: Number(roundId),
          ...data,
        }

        setProblems((prev) => [...prev, newProblem])
        return newProblem
      } catch (err) {
        console.error(err)
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [roundId]
  )

  // ----- UPDATE -----
  const updateProblem = useCallback(
    async (problemId, data) => {
      if (!roundId) throw new Error("Missing round ID")
      setLoading(true)
      setError(null)
      try {
        // const updated = await contestService.updateProblem(contestId, roundId, problemId, data)
        const updated = { ...data, problem_id: problemId }

        setProblems((prev) =>
          prev.map((p) => (p.problem_id === problemId ? updated : p))
        )
        return updated
      } catch (err) {
        console.error(err)
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [roundId]
  )

  // ----- DELETE -----
  const deleteProblem = useCallback(
    async (problemId) => {
      if (!roundId) throw new Error("Missing round ID")
      setLoading(true)
      setError(null)
      try {
        // await contestService.deleteProblem(contestId, roundId, problemId)
        console.log("[FAKE DELETE] Problem ID:", problemId)
        setProblems((prev) => prev.filter((p) => p.problem_id !== problemId))
      } catch (err) {
        console.error(err)
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [roundId]
  )

  return {
    problems,
    loading,
    error,
    addProblem,
    updateProblem,
    deleteProblem,
  }
}

export default useProblems
