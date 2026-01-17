import { useEffect, useState, useRef } from "react"
import * as signalR from "@microsoft/signalr"
import { useAuth } from "@/context/AuthContext"
import { HUB_URL } from "@/shared/config/signalRConfig"

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
    if (!token || !user?.id) return

    // 1. Create SignalR connection
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

    // 2. Setup listeners BEFORE starting
    connection.on("OrganizerDashboardUpdated", (data) => {
      if (import.meta.env.VITE_ENV === "development") {
        console.log("📊 Organizer Dashboard Updated:", data)
      }
      if (onUpdateRef.current) {
        onUpdateRef.current(data)
      }
    })

    // Connection Lifecycle Handlers
    connection.onclose((error) => {
      console.warn("🔴 SignalR CLOSED", error)
      setIsConnected(false)
    })

    connection.onreconnecting((error) => {
      console.warn("🟠 SignalR RECONNECTING", error)
      setIsConnected(false)
    })

    connection.onreconnected(async (connectionId) => {
      console.log("🟢 SignalR RECONNECTED", connectionId)

      // Re-join the organizer's group after reconnection
      try {
        await connection.invoke("JoinOrganizerDashboard", user.id)
        console.log(`🔁 Re-joined group: OrganizerDashboard_${user.id}`)
        setIsConnected(true)

        // Refetch on reconnect to ensure data is fresh
        if (onUpdateRef.current) {
          onUpdateRef.current({ reconnected: true })
        }
      } catch (err) {
        console.error("❌ Failed to re-join group after reconnect", err)
      }
    })

    // 3. Start connection and join group
    let isMounted = true

    const startConnection = async () => {
      try {
        // Start connection
        await connection.start()

        if (!isMounted) {
          connection.stop()
          return
        }

        if (import.meta.env.VITE_ENV === "development") {
          console.log("✅ Connected to Dashboard Hub")
        }

        // 4. ⚠️ REQUIRED: Explicitly join the organizer's group
        await connection.invoke("JoinOrganizerDashboard", user.id)
        if (import.meta.env.VITE_ENV === "development") {
          console.log(`✅ Joined group: OrganizerDashboard_${user.id}`)
        }

        setIsConnected(true)
      } catch (err) {
        if (!isMounted) return

        // Gracefully handle the "stopped during negotiation" error
        if (err.message && err.message.includes("stopped during negotiation")) {
          return
        }

        console.error("❌ SignalR Connection Error:", err)
        setIsConnected(false)
      }
    }

    startConnection()
    connectionRef.current = connection

    // Cleanup
    return () => {
      isMounted = false

      const leaveAndStop = async () => {
        try {
          if (connection.state === signalR.HubConnectionState.Connected) {
            await connection.invoke("LeaveOrganizerDashboard", user.id)
            await connection.stop()
          }
        } catch (err) {
          if (!err.message?.includes("stopped during negotiation")) {
            console.warn("Error stopping SignalR:", err)
          }
        }
      }
      leaveAndStop()
    }
  }, [user?.id])

  return { isConnected }
}
