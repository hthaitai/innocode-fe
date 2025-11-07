import { useEffect } from "react"
import * as signalR from "@microsoft/signalr"
import { useDispatch } from "react-redux"
import {
  updateLeaderboard,
  updateTeamScore,
} from "@/features/leaderboard/store/leaderboardSlice"

const useLeaderboardSignalR = (contestId, isFrozen) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!contestId) return

    // Build the connection with transport fallback
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://innocode-challenge-api.onrender.com/hubs/leaderboard", {
        transport:
          signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.LongPolling,
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build()

    // --- Event handlers ---

    // Full leaderboard update
    connection.on("LeaderboardUpdated", (data) => {
      console.log("Received LeaderboardUpdated event:", data)

      if (!Array.isArray(data) || isFrozen) return

      // Normalize the data for the table
      const flattened = data.flatMap((entry) =>
        (entry.teamIdList || []).map((t) => ({
          entryId: entry.entryId,
          contestId: entry.contestId,
          contestName: entry.contestName,
          teamId: t.teamId,
          teamName: t.teamName,
          rank: t.rank ?? 0,
          score: t.score ?? 0,
          snapshotAt: entry.snapshotAt ?? new Date().toISOString(),
        }))
      )

      console.log("Flattened leaderboard data:", flattened)

      dispatch(updateLeaderboard(flattened))
    })

    // Single team score update
    connection.on("ScoreUpdated", (data) => {
      console.log("Received ScoreUpdated event:", data)

      if (!data || isFrozen) return

      dispatch(
        updateTeamScore({
          teamId: data.TeamId || data.teamId,
          score: data.Score || data.score,
          rank: data.Rank || data.rank,
        })
      )
    })

    // --- Debugging connection events ---
    connection.onclose((err) => console.warn("SignalR closed:", err))
    connection.onreconnecting((err) => console.warn("SignalR reconnecting:", err))
    connection.onreconnected((id) => console.info("SignalR reconnected:", id))

    // --- Start connection ---
    const startConnection = async () => {
      try {
        await connection.start()
        console.info("SignalR connected")
        await connection.invoke("JoinLeaderboardGroup", contestId)
        console.info("Joined group:", contestId)
      } catch (err) {
        console.error("SignalR connection error:", err)
        // Optional: Retry after a delay if needed
        setTimeout(startConnection, 3000)
      }
    }

    startConnection()

    // Cleanup on unmount
    return () => {
      connection.stop()
    }
  }, [contestId, dispatch, isFrozen])
}

export default useLeaderboardSignalR
