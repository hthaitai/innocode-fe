import React, { useCallback, useEffect, useState } from "react"
import { notifications as fakeData } from "@/data/notifications" // placeholder for mock data

export const useOrganizerNotifications = () => {
  const [notifications, setNotifications] = useState(fakeData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ----- FETCH -----
  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       setLoading(true)
  //       setError(null)
  //
  //       const data = await notificationService.getAllNotifications()
  //       setNotifications(data)
  //     } catch (err) {
  //       console.error(err)
  //       setError(err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //
  //   fetchNotifications()
  // }, [])

  // ----- CREATE -----
  const sendNotification = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      // 🔹 Skip API call, just simulate
      // const newNotification = await notificationService.createNotification(data)

      const newNotification = {
        notification_id: Date.now(),
        user_id: data.user_id || null, // organizer might send to system-wide
        type: data.type,
        channel: data.channel,
        payload: data.payload,
        sent_at: new Date().toISOString(),
        sent_by: "Organizer", // inferred for UI
      }

      setNotifications((prev) => [newNotification, ...prev])
      return newNotification
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ----- DELETE -----
  const deleteNotification = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      // await notificationService.deleteNotification(id)
      console.log("[FAKE DELETE] Notification ID:", id)

      setNotifications((prev) =>
        prev.filter((n) => n.notification_id !== id)
      )
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    notifications,
    loading,
    error,
    sendNotification,
    deleteNotification,
  }
}

export default useOrganizerNotifications
