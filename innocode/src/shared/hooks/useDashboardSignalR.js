import { useEffect, useState, useRef } from "react"
import * as signalR from "@microsoft/signalr"
import { HUB_URL } from "@/shared/config/signalRConfig"
import { useAuth } from "@/context/AuthContext"

export const useDashboardSignalR = (onUpdate) => {
  const { user } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const connectionRef = useRef(null)
  const onUpdateRef = useRef(onUpdate)

  // Update ref when callback changes to avoid effect re-runs
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    const token = localStorage.getItem("token")

    console.log("🔍 [SignalR] Initializing connection...")
    console.log("🔍 [SignalR] Token exists:", !!token)
    console.log("🔍 [SignalR] User:", user)

    if (!token || !user) {
      console.warn("⚠️ [SignalR] Missing token or user, aborting connection")
      return
    }

    const userRole = user.role?.toLowerCase()
    console.log("🔍 [SignalR] Detected user role:", userRole)
    console.log("🔍 [SignalR] User ID:", user.id)

    // Only Admin and Mentor roles use this hook
    if (userRole !== "admin" && userRole !== "mentor") {
      console.warn(
        `⚠️ [SignalR] Role '${userRole}' not supported for dashboard SignalR`,
      )
      return
    }

    console.log(
      `✅ [SignalR] Role '${userRole}' is supported, proceeding with connection...`,
    )

    console.log(
      `✅ [SignalR] Role '${userRole}' is supported, proceeding with connection...`,
    )

    // 1. Create SignalR connection
    console.log("🔧 [SignalR] Building connection with HUB_URL:", HUB_URL)
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
      .configureLogging(signalR.LogLevel.Information)
      .build()

    console.log("✅ [SignalR] Connection builder configured")

    // 2. Setup listeners BEFORE starting
    console.log("🎧 [SignalR] Setting up event listeners...")

    // Role-specific dashboard update events
    connection.on("AdminDashboardUpdated", (data) => {
      console.log("📊 [SignalR Event] AdminDashboardUpdated received")
      console.log("📊 [SignalR Event] Data:", data)
      if (onUpdateRef.current) {
        onUpdateRef.current("AdminDashboardUpdated", data)
      }
    })

    connection.on("MentorDashboardUpdated", (data) => {
      console.log("📊 [SignalR Event] MentorDashboardUpdated received")
      console.log("📊 [SignalR Event] Data:", data)
      if (onUpdateRef.current) {
        onUpdateRef.current("MentorDashboardUpdated", data)
      }
    })

    // Admin-specific events (sent to AdminDashboard group)
    connection.on("ContestCreated", (data) => {
      console.log("📊 [SignalR Event] ContestCreated received")
      console.log("📊 [SignalR Event] Data:", data)
      if (onUpdateRef.current) {
        onUpdateRef.current("ContestCreated", data)
      }
    })

    connection.on("ContestStatusChanged", (data) => {
      console.log("📊 [SignalR Event] ContestStatusChanged received")
      console.log("📊 [SignalR Event] Data:", data)
      if (onUpdateRef.current) {
        onUpdateRef.current("ContestStatusChanged", data)
      }
    })

    connection.on("TeamRegistered", (data) => {
      console.log("📊 [SignalR Event] TeamRegistered received")
      console.log("📊 [SignalR Event] Data:", data)
      if (onUpdateRef.current) {
        onUpdateRef.current("TeamRegistered", data)
      }
    })

    connection.on("CertificateIssued", (data) => {
      console.log("📊 [SignalR Event] CertificateIssued received")
      console.log("📊 [SignalR Event] Data:", data)
      if (onUpdateRef.current) {
        onUpdateRef.current("CertificateIssued", data)
      }
    })

    console.log("✅ [SignalR] Event listeners registered (6 events)")
    console.log("   - AdminDashboardUpdated, MentorDashboardUpdated")
    console.log("   - ContestCreated, ContestStatusChanged")
    console.log("   - TeamRegistered, CertificateIssued")

    // Connection Lifecycle Handlers
    console.log("🎧 [SignalR] Setting up lifecycle handlers...")

    connection.onclose((error) => {
      console.log("🔴 [SignalR Lifecycle] Connection CLOSED")
      if (error) {
        console.error("🔴 [SignalR Lifecycle] Error:", error)
      }
      setIsConnected(false)
    })

    connection.onreconnecting((error) => {
      console.log("🔄 [SignalR Lifecycle] RECONNECTING...")
      if (error) {
        console.warn("🔄 [SignalR Lifecycle] Reconnecting due to error:", error)
      }
      setIsConnected(false)
    })

    connection.onreconnected(async (connectionId) => {
      console.log("🟢 [SignalR Lifecycle] RECONNECTED successfully")
      console.log("🟢 [SignalR Lifecycle] New ConnectionId:", connectionId)

      // Re-join the appropriate group after reconnection
      try {
        console.log(`🔁 [SignalR] Re-joining group for role: ${userRole}`)

        if (userRole === "admin") {
          await connection.invoke("JoinAdminDashboard")
          console.log("✅ [SignalR] Re-joined AdminDashboard group")
        } else if (userRole === "mentor") {
          await connection.invoke("JoinMentorDashboard", user.id)
          console.log(`✅ [SignalR] Re-joined MentorDashboard_${user.id} group`)
        }

        setIsConnected(true)
        console.log("✅ [SignalR] Connection state updated to: connected")

        // Refetch on reconnect to ensure data is fresh
        if (onUpdateRef.current) {
          console.log("🔄 [SignalR] Triggering data refresh after reconnect")
          onUpdateRef.current("Reconnected")
        }
      } catch (err) {
        console.error(
          "❌ [SignalR] Failed to re-join group after reconnect:",
          err,
        )
      }
    })

    // 3. Start connection and join appropriate group
    let isMounted = true
    console.log("🚀 [SignalR] Starting connection process...")

    const startConnection = async () => {
      try {
        console.log("🔌 [SignalR] Attempting to start connection...")
        // Start connection
        await connection.start()
        console.log("✅ [SignalR] Connection started successfully")
        console.log("🔍 [SignalR] Connection state:", connection.state)

        if (!isMounted) {
          console.warn("⚠️ [SignalR] Component unmounted, stopping connection")
          connection.stop()
          return
        }

        console.log("✅ [SignalR] Connected to DashboardHub")

        // 4. ⚠️ REQUIRED: Explicitly join the appropriate group
        console.log(`🔑 [SignalR] Joining group for role: ${userRole}`)

        if (userRole === "admin") {
          console.log("📞 [SignalR] Invoking JoinAdminDashboard...")
          await connection.invoke("JoinAdminDashboard")
          console.log("✅ [SignalR] Joined AdminDashboard group")
        } else if (userRole === "mentor") {
          console.log(
            `📞 [SignalR] Invoking JoinMentorDashboard with ID: ${user.id}`,
          )
          await connection.invoke("JoinMentorDashboard", user.id)
          console.log(`✅ [SignalR] Joined MentorDashboard_${user.id} group`)
        }

        setIsConnected(true)
        console.log("✅ [SignalR] Connection state updated to: connected")
        console.log(
          "🎉 [SignalR] Setup complete! Ready to receive notifications",
        )
      } catch (err) {
        if (!isMounted) {
          console.warn(
            "⚠️ [SignalR] Error occurred but component already unmounted",
          )
          return
        }

        // Gracefully handle the "stopped during negotiation" error
        if (err.message && err.message.includes("stopped during negotiation")) {
          console.warn(
            "⚠️ [SignalR] Connection stopped during negotiation (normal in dev mode)",
          )
          return
        }

        console.error("❌ [SignalR] Connection Error:", err)
        console.error("❌ [SignalR] Error details:", {
          message: err.message,
          stack: err.stack,
          name: err.name,
        })
        setIsConnected(false)
      }
    }

    startConnection()
    connectionRef.current = connection

    // Cleanup
    return () => {
      console.log("🧹 [SignalR] Cleanup initiated (component unmounting)")
      isMounted = false

      const cleanup = async () => {
        try {
          console.log(
            "🔍 [SignalR] Current connection state:",
            connection.state,
          )

          if (connection.state === signalR.HubConnectionState.Connected) {
            console.log("🚪 [SignalR] Leaving group before disconnect...")

            // Leave the group before disconnecting
            if (userRole === "admin") {
              console.log("📞 [SignalR] Invoking LeaveAdminDashboard...")
              await connection.invoke("LeaveAdminDashboard")
              console.log("✅ [SignalR] Left AdminDashboard group")
            } else if (userRole === "mentor") {
              console.log(
                `📞 [SignalR] Invoking LeaveMentorDashboard with ID: ${user.id}`,
              )
              await connection.invoke("LeaveMentorDashboard", user.id)
              console.log(`✅ [SignalR] Left MentorDashboard_${user.id} group`)
            }

            console.log("🔌 [SignalR] Stopping connection...")
            await connection.stop()
            console.log("✅ [SignalR] Connection stopped successfully")
          } else {
            console.log(
              "ℹ️ [SignalR] Connection not in Connected state, skipping cleanup",
            )
          }
        } catch (err) {
          if (!err.message?.includes("stopped during negotiation")) {
            console.warn("⚠️ [SignalR] Error during cleanup:", err)
          } else {
            console.log(
              "ℹ️ [SignalR] Cleanup stopped during negotiation (normal)",
            )
          }
        }
      }

      cleanup()
    }
  }, [user]) // Re-run if user changes

  return { isConnected }
}
