import React, { useCallback, useState } from "react"
import { appeals as fakeData } from '@/data/contests/appeals'
// import appealService from "../../../../services/appealService" // for real API

export const useAppeals = () => {
  const [appeals, setAppeals] = useState(fakeData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ----- FETCH ALL (Future API Ready) -----
  // const fetchAppeals = useCallback(async () => {
  //   try {
  //     setLoading(true)
  //     setError(null)
  //     const data = await appealService.getAllAppeals()
  //     setAppeals(data)
  //   } catch (err) {
  //     console.error(err)
  //     setError(err)
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [])

  // useEffect(() => {
  //   fetchAppeals()
  // }, [fetchAppeals])

  // ----- UPDATE SINGLE APPEAL -----
  const updateAppeal = useCallback(async (appealId, updates) => {
    setLoading(true)
    setError(null)

    try {
      // const updated = await appealService.updateAppeal(appealId, updates)
      const updated = { ...updates, appeal_id: appealId }

      setAppeals((prev) =>
        prev.map((a) => (a.appeal_id === appealId ? { ...a, ...updated } : a))
      )

      return updated
    } catch (err) {
      console.error("Failed to update appeal:", err)
      setError(err.message || "Failed to update appeal")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const resetError = useCallback(() => setError(null), [])

  return {
    appeals,
    loading,
    error,
    updateAppeal,
    resetError,
    // refetch: fetchAppeals, // uncomment once API is ready
  }
}

export default useAppeals
