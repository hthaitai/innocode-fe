import { useEffect, useState, useRef } from "react"
import * as signalR from "@microsoft/signalr"
import { useAuth } from "@/context/AuthContext"
import { HUB_URL } from "@/shared/config/signalRConfig"

const isDev = import.meta.env.VITE_ENV === "development"
const log = (message, ...args) => isDev && console.log(message, ...args)
const warn = (message, ...args) => console.warn(message, ...args)
const error = (message, ...args) => console.error(message, ...args)

export const useOrganizerDashboardSignalR = (onUpdate) => {
  const { user } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const connectionRef = useRef(null)
  const onUpdateRef = useRef(onUpdate)

  // Update ref when callback changes
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token || !user?.id) {
      warn("⚠️ [OrganizerSignalR] Missing token or user ID")
      return
    }

    log("🔌 [OrganizerSignalR] Connecting to hub...", { userId: user.id })

    // Create SignalR connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff: 2s, 10s, 30s
          if (retryContext.previousRetryCount === 0) return 2000
          if (retryContext.previousRetryCount === 1) return 10000
          return 30000
        },
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    // Setup event listener
    connection.on("OrganizerDashboardUpdated", (data) => {
      log("📊 [OrganizerSignalR] Dashboard updated", data)
      onUpdateRef.current?.(data)
    })

    // Connection lifecycle handlers
    connection.onclose((err) => {
      if (err) error("🔴 [OrganizerSignalR] Connection closed", err)
      setIsConnected(false)
    })

    connection.onreconnecting((err) => {
      if (err) warn("🔄 [OrganizerSignalR] Reconnecting...", err)
      setIsConnected(false)
    })

    connection.onreconnected(async (connectionId) => {
      log("🟢 [OrganizerSignalR] Reconnected", connectionId)

      try {
        await connection.invoke("JoinOrganizerDashboard", user.id)
        setIsConnected(true)
        onUpdateRef.current?.({ reconnected: true })
      } catch (err) {
        error("❌ [OrganizerSignalR] Failed to re-join group", err)
      }
    })

    // Start connection
    let isMounted = true

    const startConnection = async () => {
      try {
        await connection.start()

        if (!isMounted) {
          connection.stop()
          return
        }

        await connection.invoke("JoinOrganizerDashboard", user.id)
        setIsConnected(true)
        log("✅ [OrganizerSignalR] Connected and joined group")
      } catch (err) {
        if (!isMounted) return

        // Gracefully handle negotiation errors (common in dev mode)
        if (err.message?.includes("stopped during negotiation")) {
          return
        }

        error("❌ [OrganizerSignalR] Connection failed", err)
        setIsConnected(false)
      }
    }

    startConnection()
    connectionRef.current = connection

    // Cleanup
    return () => {
      isMounted = false

      const cleanup = async () => {
        try {
          if (connection.state === signalR.HubConnectionState.Connected) {
            await connection.invoke("LeaveOrganizerDashboard", user.id)
            await connection.stop()
            log("🧹 [OrganizerSignalR] Disconnected and cleaned up")
          }
        } catch (err) {
          if (!err.message?.includes("stopped during negotiation")) {
            warn("⚠️ [OrganizerSignalR] Cleanup error", err)
          }
        }
      }

      cleanup()
    }
  }, [user?.id])

  return { isConnected }
}
