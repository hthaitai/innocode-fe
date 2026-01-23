import { useEffect, useState } from "react"
import { contestService } from "@/features/contest/services/contestService"

export const useContestDetail = (contestId) => {
  const [contest, setContest] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!contestId) {
      setError("Contest ID is required")
      return
    }

    const fetchContestDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await contestService.getContestById(contestId)

        // Use data directly from API
        setContest(data)
      } catch (error) {
        console.error("❌ Error fetching contest detail:", error)
        setError(error.message || "Failed to load contest details")
      } finally {
        setLoading(false)
      }
    }

    fetchContestDetail()
  }, [contestId])

  return {
    contest,
    loading,
    error,
  }
}

export default useContestDetail
