import { useEffect, useRef, useState, useCallback } from "react"
import * as signalR from "@microsoft/signalr"

const HUB_URL = "https://innocode-challenge-api.onrender.com/hubs/leaderboard"

/**
 * Custom hook for live leaderboard updates via SignalR
 * @param {string} contestId - The contest ID to subscribe to
 * @param {function} refetch - RTK Query refetch function to call when leaderboard updates
 * @param {boolean} enabled - Whether to enable the connection (default: true)
 */
export const useLiveLeaderboard = (contestId, refetch, enabled = true) => {
  const connectionRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)
  const isConnectingRef = useRef(false) // Track if we're currently connecting
  const currentContestIdRef = useRef(contestId) // Track current contestId
  const refetchRef = useRef(refetch) // Store refetch function in ref

  // Update refetch ref when it changes
  useEffect(() => {
    refetchRef.current = refetch
  }, [refetch])

  const MAX_RECONNECT_ATTEMPTS = 5
  const RECONNECT_DELAY = 3000

  const connect = useCallback(() => {
    if (!contestId || !enabled) {
      return
    }

    // Check if we're already connecting/connected for this contest
    // Use the ref value BEFORE updating it to check the actual current state
    const previousContestId = currentContestIdRef.current
    const isForSameContest = previousContestId === contestId

    // Clean up existing connection properly
    if (connectionRef.current) {
      const state = connectionRef.current.state

      // Only skip if actively connecting to the same contest
      if (
        state === signalR.HubConnectionState.Connecting &&
        isForSameContest &&
        isConnectingRef.current
      ) {
        if (import.meta.env.VITE_ENV === "development") {
          console.log(
            "Connection already in progress for same contest, skipping..."
          )
        }
        return
      }

      // If connection is already connected for the same contest, verify group subscription
      if (state === signalR.HubConnectionState.Connected && isForSameContest) {
        if (import.meta.env.VITE_ENV === "development") {
          console.log(
            "Connection already active for same contest, verifying group subscription"
          )
        }
        const groupName = `leaderboard_${contestId}`
        connectionRef.current
          .invoke("JoinGroup", groupName)
          .catch(() =>
            connectionRef.current.invoke("JoinLeaderboardGroup", contestId)
          )
          .then(() => {
            if (import.meta.env.VITE_ENV === "development") {
              console.log("✅ Verified group subscription")
            }
          })
          .catch((err) => {
            if (import.meta.env.VITE_ENV === "development") {
              console.warn("Could not verify group subscription:", err)
            }
          })
        // Don't recreate connection, just verify subscription
        return
      }

      // Stop existing connection if it's for a different contest or disconnected
      // Always stop if contest changed, or if disconnected/disconnecting
      if (
        !isForSameContest ||
        state === signalR.HubConnectionState.Disconnected ||
        state === signalR.HubConnectionState.Disconnecting
      ) {
        if (import.meta.env.VITE_ENV === "development") {
          console.log("Stopping existing connection before reconnecting", {
            isForSameContest,
            state,
            previousContestId,
            newContestId: contestId,
          })
        }
        connectionRef.current.stop().catch((err) => {
          if (import.meta.env.VITE_ENV === "development") {
            console.warn("Error stopping existing connection:", err)
          }
        })
        connectionRef.current = null
      }
    }

    // Update refs after checking previous state
    isConnectingRef.current = true
    currentContestIdRef.current = contestId

    // Get token for authentication
    const token = localStorage.getItem("token")

    // Create connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token || "",
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          const delay = Math.min(
            2000 * Math.pow(2, retryContext.previousRetryCount),
            30000
          )
          return delay
        },
      })
      .configureLogging(
        import.meta.env.VITE_ENV === "development"
          ? signalR.LogLevel.Information
          : signalR.LogLevel.Warning
      )
      .build()

    // Connection event handlers
    connection.onclose((error) => {
      setIsConnected(false)
      isConnectingRef.current = false

      // Only attempt reconnect if this is still the current contest
      if (currentContestIdRef.current === contestId && enabled) {
        if (error) {
          console.error("SignalR connection closed with error:", error)
          setConnectionError(error.message || "Connection closed")

          // Manual reconnection if automatic reconnect fails
          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttemptsRef.current++
            reconnectTimeoutRef.current = setTimeout(() => {
              if (currentContestIdRef.current === contestId && enabled) {
                connect()
              }
            }, RECONNECT_DELAY)
          } else {
            setConnectionError("Failed to reconnect after multiple attempts")
          }
        } else {
          setConnectionError(null)
        }
      }
    })

    connection.onreconnecting((error) => {
      setIsConnected(false)
      if (error) {
        console.warn("SignalR reconnecting...", error)
      }
    })

    connection.onreconnected((connectionId) => {
      setIsConnected(true)
      setConnectionError(null)
      reconnectAttemptsRef.current = 0
      isConnectingRef.current = false
      console.log("SignalR reconnected:", connectionId)

      // Re-subscribe to contest updates after reconnection
      if (currentContestIdRef.current) {
        const groupName = `leaderboard_${currentContestIdRef.current}`
        connection
          .invoke("JoinGroup", groupName)
          .catch(() =>
            connection.invoke(
              "JoinLeaderboardGroup",
              currentContestIdRef.current
            )
          )
          .catch((err) => {
            console.error(
              "Could not rejoin leaderboard group after reconnection:",
              err
            )
          })
      }
    })

    // Listen for leaderboard updates
    connection.on("LeaderboardUpdated", (data) => {
      if (import.meta.env.VITE_ENV === "development") {
        console.log("📊 Live leaderboard update received:", data)
      }

      // Trigger refetch to get fresh data from API
      if (refetchRef.current && typeof refetchRef.current === "function") {
        try {
          if (import.meta.env.VITE_ENV === "development") {
            console.log("🔄 Triggering leaderboard refetch...")
          }
          refetchRef.current()
        } catch (error) {
          console.error("Error triggering refetch:", error)
        }
      }
    })

    // Optional: Listen for successful group join confirmation
    connection.on("JoinedGroup", (data) => {
      if (import.meta.env.VITE_ENV === "development") {
        console.log("✅ Joined leaderboard group:", data)
      }
    })

    // Start connection
    connection
      .start()
      .then(() => {
        // Check if contestId hasn't changed during connection
        if (currentContestIdRef.current !== contestId) {
          if (import.meta.env.VITE_ENV === "development") {
            console.warn(
              "ContestId changed during connection, disconnecting..."
            )
          }
          connection.stop()
          return
        }

        isConnectingRef.current = false
        setIsConnected(true)
        setConnectionError(null)
        reconnectAttemptsRef.current = 0

        if (import.meta.env.VITE_ENV === "development") {
          console.log("✅ SignalR connected to leaderboard hub")
        }

        // Join the contest leaderboard group
        // Backend uses group name format: "leaderboard_{contestId}"
        if (contestId) {
          const groupName = `leaderboard_${contestId}`
          // Try JoinGroup first (standard SignalR method), fallback to custom method
          return connection
            .invoke("JoinGroup", groupName)
            .catch(() => connection.invoke("JoinLeaderboardGroup", contestId))
            .catch((err) => {
              if (import.meta.env.VITE_ENV === "development") {
                console.warn(
                  "Could not join group, but connection is active:",
                  err
                )
              }
              return Promise.resolve()
            })
        }
      })
      .then(() => {
        if (contestId && import.meta.env.VITE_ENV === "development") {
          console.log(
            `✅ Subscribed to contest ${contestId} leaderboard updates`
          )
        }
      })
      .catch((error) => {
        isConnectingRef.current = false
        setIsConnected(false)
        console.error("❌ SignalR connection error:", error)
        setConnectionError(error.message || "Failed to connect")

        // Log more details for debugging
        if (import.meta.env.VITE_ENV === "development") {
          console.error("Connection error details:", {
            contestId,
            enabled,
            connectionState: connectionRef.current?.state,
            errorMessage: error.message,
            errorStack: error.stack,
          })
        }

        // Retry connection if it failed and we still have the same contestId
        if (currentContestIdRef.current === contestId && enabled) {
          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttemptsRef.current++
            reconnectTimeoutRef.current = setTimeout(() => {
              // Only retry if contestId hasn't changed
              if (
                currentContestIdRef.current === contestId &&
                enabled &&
                !isConnectingRef.current
              ) {
                if (import.meta.env.VITE_ENV === "development") {
                  console.log(
                    `🔄 Retrying connection (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})...`
                  )
                }
                connectRef.current()
              }
            }, RECONNECT_DELAY)
          } else {
            setConnectionError("Failed to connect after multiple attempts")
          }
        }
      })

    connectionRef.current = connection
  }, [contestId, enabled])

  const disconnect = useCallback(() => {
    isConnectingRef.current = false

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (connectionRef.current) {
      const state = connectionRef.current.state
      const contestIdToLeave = currentContestIdRef.current

      // Only try to leave group if connected
      if (state === signalR.HubConnectionState.Connected && contestIdToLeave) {
        const groupName = `leaderboard_${contestIdToLeave}`
        connectionRef.current
          .invoke("LeaveGroup", groupName)
          .catch(() =>
            connectionRef.current.invoke(
              "LeaveLeaderboardGroup",
              contestIdToLeave
            )
          )
          .catch((err) => {
            console.warn("Could not leave leaderboard group:", err)
          })
          .finally(() => {
            connectionRef.current?.stop().catch((err) => {
              console.warn("Error stopping connection:", err)
            })
            connectionRef.current = null
            setIsConnected(false)
          })
      } else {
        // If not connected, just stop
        connectionRef.current.stop().catch((err) => {
          console.warn("Error stopping connection:", err)
        })
        connectionRef.current = null
        setIsConnected(false)
      }

      console.log("SignalR disconnected")
    }
  }, [])

  // Store callbacks in refs to avoid dependency issues
  const connectRef = useRef(connect)
  const disconnectRef = useRef(disconnect)

  // Update refs when callbacks change
  useEffect(() => {
    connectRef.current = connect
    disconnectRef.current = disconnect
  }, [connect, disconnect])

  // Effect to manage connection lifecycle - only depend on contestId and enabled
  useEffect(() => {
    if (!enabled || !contestId) {
      disconnectRef.current()
      return
    }

    // Update ref when contestId changes
    const previousContestId = currentContestIdRef.current
    const contestIdChanged = previousContestId !== contestId
    currentContestIdRef.current = contestId

    const connection = connectionRef.current
    const isConnectionActive =
      connection && connection.state === signalR.HubConnectionState.Connected

    // Always connect if:
    // 1. ContestId changed (navigating to different contest or coming back)
    // 2. No connection exists
    // 3. Connection exists but is disconnected
    if (contestIdChanged || !connection || !isConnectionActive) {
      if (import.meta.env.VITE_ENV === "development") {
        console.log(`🔄 Connecting to leaderboard for contest: ${contestId}`, {
          previousContestId,
          currentContestId: contestId,
          hasConnection: !!connection,
          connectionState: connection?.state,
          reason: contestIdChanged
            ? "contestId changed"
            : !connection
            ? "no connection"
            : "connection disconnected",
        })
      }
      connectRef.current()
    } else if (isConnectionActive && !contestIdChanged) {
      // Connection exists and is connected for the same contest
      // Ensure we're still subscribed to the group (rejoin if needed)
      // This handles cases where group subscription might have been lost
      const groupName = `leaderboard_${contestId}`
      connection
        .invoke("JoinGroup", groupName)
        .catch(() => connection.invoke("JoinLeaderboardGroup", contestId))
        .then(() => {
          if (import.meta.env.VITE_ENV === "development") {
            console.log(
              `✅ Re-verified subscription to contest ${contestId} leaderboard group`
            )
          }
        })
        .catch((err) => {
          if (import.meta.env.VITE_ENV === "development") {
            console.warn("Could not verify/rejoin leaderboard group:", err)
          }
        })
    }

    // Cleanup function - only disconnect if contestId changed or disabled
    return () => {
      // Only cleanup if contestId changed or component unmounting
      if (currentContestIdRef.current !== contestId || !enabled) {
        if (import.meta.env.VITE_ENV === "development") {
          console.log(`🔌 Cleaning up connection for contest: ${contestId}`)
        }
        disconnectRef.current()
      }
    }
  }, [contestId, enabled])

  return {
    isConnected,
    connectionError,
    reconnect: connect,
    disconnect,
  }
}
