import { useCallback, useEffect, useState } from "react"
import { leaderboard as fakeData } from "../../../data/contests/leaderboard"
// import { leaderboardService } from "../../../services/leaderboard/leaderboardService"

export const useLeaderboard = (contestId) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ----- FETCH LEADERBOARD -----
  useEffect(() => {
    if (!contestId) return

    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)

        // ===== FAKE DATA (for local dev) =====
        const filteredData = fakeData.filter(
          (entry) => entry.contest_id === Number(contestId)
        )
        setLeaderboard(filteredData)

        // ===== REAL API CALL (uncomment later) =====
        // const data = await leaderboardService.getLeaderboard(contestId)
        // setLeaderboard(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setError(err.message || "Failed to load leaderboard")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [contestId])

  // ----- FREEZE LEADERBOARD -----
  const freezeLeaderboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // await leaderboardService.freezeLeaderboard(contestId)
      console.log("[FAKE ACTION] Freeze leaderboard for contest:", contestId)
    } catch (err) {
      console.error(err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [contestId])

  return {
    leaderboard,
    loading,
    error,
    freezeLeaderboard,
  }
}

export default useLeaderboard
