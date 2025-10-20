import { useState, useEffect, useCallback } from "react"
import { contestService } from "../../services/mockService"

export const useContests = () => {
  const [contests, setContests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ----- Fetch contests -----
  const fetchContests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await contestService.getContests()
      // Ensure contests is always an array
      setContests(Array.isArray(data) ? data : data?.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContests()
  }, [fetchContests])

  // ----- Validation -----
  const validateContest = useCallback((data) => {
    const errors = {}
    if (!data.name?.trim()) errors.name = "Contest name is required"
    if (!data.year) errors.year = "Year is required"
    if (!data.description?.trim())
      errors.description = "Description is required"
    if (!data.status) errors.status = "Status is required"
    return errors
  }, [])

  // ----- CRUD operations -----
  const addContest = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      const newContest = await contestService.addContest(data)
      setContests((prev) => [...prev, newContest])
      return newContest
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateContest = useCallback(async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      const updated = await contestService.updateContest(id, data)
      setContests((prev) =>
        prev.map((c) => (c.contest_id === id ? updated : c))
      )
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteContest = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      await contestService.deleteContest(id)
      setContests((prev) => prev.filter((c) => c.contest_id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    contests,
    loading,
    error,
    validateContest,
    fetchContests,
    addContest,
    updateContest,
    deleteContest,
  }
}
