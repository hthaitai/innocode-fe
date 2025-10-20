import { useState, useEffect, useCallback } from "react"
import { contestService } from "../../services/mockService"

export const useTestCase = (contestId, roundId, problemId) => {
  const [testCases, setTestCases] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // --- Fetch all test cases for a problem ---
  const fetchTestCases = useCallback(async () => {
    if (!contestId || !roundId || !problemId) return

    setLoading(true)
    setError(null)
    try {
      const contest = await contestService.getContestById(contestId)
      const round = contest.rounds.find((r) => r.round_id === roundId)
      if (!round) throw new Error("Round not found")

      const problem = round.problems.find((p) => p.problem_id === problemId)
      if (!problem) throw new Error("Problem not found")

      setTestCases(problem.test_cases || [])
    } catch (err) {
      console.error("Failed to fetch test cases:", err)
      setError(err.message || "Failed to load test cases")
    } finally {
      setLoading(false)
    }
  }, [contestId, roundId, problemId])

  useEffect(() => {
    fetchTestCases()
  }, [fetchTestCases])

  // --- Add a test case ---
  const addTestCase = useCallback(
    async (data) => {
      if (!contestId || !roundId || !problemId)
        throw new Error("Missing contest, round, or problem ID")

      setLoading(true)
      setError(null)
      try {
        const newTestCase = await contestService.addTestCase(
          contestId,
          roundId,
          problemId,
          data
        )
        setTestCases((prev) => [...prev, newTestCase])
        return newTestCase
      } catch (err) {
        console.error("Failed to add test case:", err)
        setError(err.message || "Failed to add test case")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [contestId, roundId, problemId]
  )

  // --- Update a test case ---
  const updateTestCase = useCallback(
    async (testCaseId, data) => {
      if (!contestId || !roundId || !problemId)
        throw new Error("Missing contest, round, or problem ID")

      setLoading(true)
      setError(null)
      try {
        // For mock service, we’ll simulate an update by replacing locally
        setTestCases((prev) =>
          prev.map((tc) => (tc.test_case_id === testCaseId ? { ...tc, ...data } : tc))
        )
        return { test_case_id: testCaseId, ...data }
      } catch (err) {
        console.error("Failed to update test case:", err)
        setError(err.message || "Failed to update test case")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [contestId, roundId, problemId]
  )

  // --- Delete a test case ---
  const deleteTestCase = useCallback(
    async (testCaseId) => {
      if (!contestId || !roundId || !problemId)
        throw new Error("Missing contest, round, or problem ID")

      setLoading(true)
      setError(null)
      try {
        setTestCases((prev) => prev.filter((tc) => tc.test_case_id !== testCaseId))
      } catch (err) {
        console.error("Failed to delete test case:", err)
        setError(err.message || "Failed to delete test case")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [contestId, roundId, problemId]
  )

  return {
    testCases,
    loading,
    error,
    fetchTestCases,
    addTestCase,
    updateTestCase,
    deleteTestCase,
  }
}