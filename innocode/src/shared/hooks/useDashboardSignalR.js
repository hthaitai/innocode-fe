import { useEffect, useState, useRef } from "react"
import * as signalR from "@microsoft/signalr"

const HUB_URL = "https://innocode-challenge-api.onrender.com/hubs/dashboard"

export const useDashboardSignalR = (onUpdate) => {
  const [isConnected, setIsConnected] = useState(false)
  const connectionRef = useRef(null)
  const onUpdateRef = useRef(onUpdate)

  // Update ref when callback changes to avoid effect re-runs
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    // Create SignalR connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: false,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff: 2s, 10s, 30s
          if (retryContext.previousRetryCount === 0) return 2000
          if (retryContext.previousRetryCount === 1) return 10000
          return 30000
        },
      })
      .configureLogging(signalR.LogLevel.Critical)
      .build()

    // List of events that should trigger a dashboard refresh
    const dashboardEvents = [
      "DashboardUpdated",
      "ContestCreated",
      "ContestStatusChanged",
      "TeamRegistered",
      "CertificateIssued",
    ]

    // Register handlers for each event
    dashboardEvents.forEach((eventName) => {
      connection.on(eventName, (data) => {
        if (import.meta.env.VITE_ENV === "development") {
          console.log(`📊 SignalR Event [${eventName}]:`, data)
        }
        if (onUpdateRef.current) {
          // Pass event name and data so component can show specific notifications
          onUpdateRef.current(eventName, data)
        }
      })
    })

    // Connection Lifecycle Handlers
    connection.onclose((error) => {
      if (error)
        console.error("🔴 SignalR Connection Closed with error:", error)
      setIsConnected(false)
    })

    connection.onreconnecting((error) => {
      if (import.meta.env.VITE_ENV === "development") {
        console.log("🔄 SignalR Reconnecting...", error)
      }
      setIsConnected(false)
    })

    connection.onreconnected((connectionId) => {
      if (import.meta.env.VITE_ENV === "development") {
        console.log("🟢 SignalR Reconnected. ConnectionId:", connectionId)
      }
      setIsConnected(true)
      // Refetch on reconnect to ensure data is fresh
      if (onUpdateRef.current) onUpdateRef.current()
    })

    // Start connection
    let isMounted = true

    connection
      .start()
      .then(() => {
        if (!isMounted) {
          connection.stop()
          return
        }
        if (import.meta.env.VITE_ENV === "development") {
          console.log("✅ SignalR Connected to Dashboard Hub", connection)
        }
        setIsConnected(true)
      })
      .catch((err) => {
        if (!isMounted) return // Ignore errors if we've already unmounted

        // Gracefully handle the "stopped during negotiation" error which is common in React Strict Mode
        if (err.message && err.message.includes("stopped during negotiation")) {
          return
        }

        console.error("❌ SignalR Connection Error:", err)
        setIsConnected(false)
      })

    connectionRef.current = connection

    return () => {
      isMounted = false
      if (connection) {
        connection.stop().catch((err) => {
          // Ignore errors during stop, especially if already stopping
          if (!err.message?.includes("stopped during negotiation")) {
            console.warn("Error stopping SignalR:", err)
          }
        })
      }
    }
  }, []) // Run once on mount

  return { isConnected }
}
