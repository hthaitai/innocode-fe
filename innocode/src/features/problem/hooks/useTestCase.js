import { useState, useCallback } from "react"
import { testCases as fakeData } from '@/data/contests/testCases'

export const useTestCases = (contestId, roundId, problemId) => {
  // ✅ Initialize test cases filtered by problem_id
  const [testCases, setTestCases] = useState(() =>
    problemId
      ? fakeData.filter((tc) => tc.problem_id === Number(problemId))
      : fakeData
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // // ----- FETCH -----
  // useEffect(() => {
  //   const fetchTestCases = async () => {
  //     if (!contestId || !roundId || !problemId) return
  //     try {
  //       setLoading(true)
  //       setError(null)
  //       const contest = await contestService.getContestById(contestId)
  //       const round = contest.rounds.find((r) => r.round_id === roundId)
  //       const problem = round?.problems?.find((p) => p.problem_id === problemId)
  //       setTestCases(problem?.test_cases || [])
  //     } catch (err) {
  //       console.error(err)
  //       setError(err.message || "Failed to load test cases")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchTestCases()
  // }, [contestId, roundId, problemId])

  // ----- CREATE -----
  const addTestCase = useCallback(
    async (data) => {
      if (!problemId) throw new Error("Missing problem ID")

      setLoading(true)
      setError(null)
      try {
        // const newTestCase = await contestService.addTestCase(contestId, roundId, problemId, data)
        const newTestCase = {
          test_case_id: Date.now(),
          created_at: new Date().toISOString(),
          problem_id: Number(problemId),
          ...data,
        }

        setTestCases((prev) => [...prev, newTestCase])
        return newTestCase
      } catch (err) {
        console.error(err)
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [problemId]
  )

  // ----- UPDATE -----
  const updateTestCase = useCallback(
    async (id, data) => {
      if (!problemId) throw new Error("Missing problem ID")

      setLoading(true)
      setError(null)
      try {
        // const updated = await contestService.updateTestCase(contestId, roundId, problemId, id, data)
        const updated = { ...data, test_case_id: id }

        setTestCases((prev) =>
          prev.map((tc) => (tc.test_case_id === id ? updated : tc))
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
    [problemId]
  )

  // ----- DELETE -----
  const deleteTestCase = useCallback(
    async (id) => {
      if (!problemId) throw new Error("Missing problem ID")

      setLoading(true)
      setError(null)
      try {
        // await contestService.deleteTestCase(contestId, roundId, problemId, id)
        console.log("[FAKE DELETE] Test Case ID:", id)

        setTestCases((prev) => prev.filter((tc) => tc.test_case_id !== id))
      } catch (err) {
        console.error(err)
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [problemId]
  )

  return {
    testCases,
    loading,
    error,
    addTestCase,
    updateTestCase,
    deleteTestCase,
  }
}

export default useTestCases
