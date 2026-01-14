import { useEffect, useState, useRef } from "react"
import * as signalR from "@microsoft/signalr"
import { useAuth } from "@/context/AuthContext"

const HUB_URL = "https://innocode-challenge-api.onrender.com/hubs/dashboard"

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

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: false,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    // --- LIFECYCLE LOGS ---
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

      try {
        await connection.invoke("JoinOrganizerDashboard", user.id)
        console.log(`🔁 Re-joined group: OrganizerDashboard_${user.id}`)
        setIsConnected(true)
      } catch (err) {
        console.error("❌ Failed to re-join group after reconnect", err)
      }
    })

    // Register event handlers
    connection.on("OrganizerDashboardUpdated", (data) => {
      if (import.meta.env.VITE_ENV === "development") {
        console.log("📊 Organizer Dashboard Updated:", data)
      }
      if (onUpdateRef.current) {
        onUpdateRef.current(data)
      }
    })

    const startConnection = async () => {
      try {
        await connection.start()
        if (import.meta.env.VITE_ENV === "development") {
          console.log("✅ Connected to Dashboard Hub")
        }

        // Join the organizer's group
        await connection.invoke("JoinOrganizerDashboard", user.id)
        if (import.meta.env.VITE_ENV === "development") {
          console.log(`✅ Joined group: OrganizerDashboard_${user.id}`)
        }

        setIsConnected(true)
      } catch (err) {
        console.error("❌ SignalR Connection Error:", err)
        setIsConnected(false)
      }
    }

    startConnection()
    connectionRef.current = connection

    // Cleanup
    return () => {
      const leaveAndStop = async () => {
        try {
          if (connection.state === signalR.HubConnectionState.Connected) {
            await connection.invoke("LeaveOrganizerDashboard", user.id)
            await connection.stop()
          }
        } catch (err) {
          console.warn("Error stopping SignalR:", err)
        }
      }
      leaveAndStop()
    }
  }, [user?.id])

  return { isConnected }
}
