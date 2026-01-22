import { useEffect, useState } from "react"
import roundApi from "@/api/roundApi"

export const useRoundDetail = (roundId) => {
  const [round, setRound] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errorCode, setErrorCode] = useState(null)

  useEffect(() => {
    if (!roundId) {
      setError("Round ID is required")
      return
    }

    const fetchRoundDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        setErrorCode(null)

        const response = await roundApi.getById(roundId)

        // Extract data from response
        const data = response.data?.data || response.data
        setRound(data)
      } catch (err) {
        console.error("❌ Error fetching round detail:", err)

        // Extract error details from response
        const errorData = err.response?.data?.data || err.response?.data
        const code = errorData?.errorCode || err.response?.data?.code
        const message =
          errorData?.errorMessage || err.response?.data?.message || err.message

        setErrorCode(code)
        setError(message || "Failed to load round details")
      } finally {
        setLoading(false)
      }
    }

    fetchRoundDetail()
  }, [roundId])

  return {
    round,
    loading,
    error,
    errorCode,
  }
}

export default useRoundDetail
