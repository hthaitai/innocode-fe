import { useState, useEffect, useCallback } from "react"
import { contestService } from "../../services/mockService"

export const useContestDetail = (contestId) => {
  const [contest, setContest] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchContest = useCallback(async () => {
    if (!contestId) return
    setLoading(true)
    setError(null)
    try {
      const data = await contestService.getContestById(Number(contestId))
      setContest(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [contestId])

  useEffect(() => {
    fetchContest()
  }, [fetchContest])

  const updateContest = useCallback(
    async (data) => {
      setLoading(true)
      setError(null)
      try {
        const updated = await contestService.updateContest(contestId, data)
        setContest(updated) // update local state so UI refreshes
        return updated
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [contestId]
  )

  const deleteContest = useCallback(async () => {
    if (!contest) return
    setLoading(true)
    setError(null)
    try {
      await contestService.deleteContest(contestId)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [contest, contestId])

  return {
    contest,
    loading,
    error,
    fetchContest,
    updateContest,
    deleteContest,
  }
}
