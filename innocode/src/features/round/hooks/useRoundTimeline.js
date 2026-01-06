import { useState, useEffect } from "react"
import roundApi from "@/api/roundApi"

/**
 * Custom hook to fetch round timeline data
 * @param {string} roundId - The ID of the round
 * @returns {object} - { timeline, loading, error }
 */
const useRoundTimeline = (roundId) => {
  const [timeline, setTimeline] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!roundId) {
      setTimeline(null)
      setLoading(false)
      setError(null)
      return
    }

    const fetchTimeline = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await roundApi.getTimeline(roundId)
        setTimeline(response.data?.data || null)
      } catch (err) {
        console.error("Error fetching round timeline:", err)
        setError(err.response?.data?.message || "Failed to load timeline")
        setTimeline(null)
      } finally {
        setLoading(false)
      }
    }

    fetchTimeline()
  }, [roundId])

  return { timeline, loading, error }
}

export default useRoundTimeline
