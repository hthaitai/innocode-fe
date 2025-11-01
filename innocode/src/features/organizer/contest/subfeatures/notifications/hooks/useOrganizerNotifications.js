import { useCallback, useEffect, useState } from "react"
import { notifications as fakeData } from "@/data/notifications"

export const useOrganizerNotifications = () => {
  const [notifications, setNotifications] = useState(fakeData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       setLoading(true)
  //       setError(null)
  //       const data = await notificationService.getAllNotifications()
  //       setNotifications(data)
  //     } catch (err) {
  //       console.error(err)
  //       setError(err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchNotifications()
  // }, [])

  // ----- CREATE -----
  const sendNotification = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      // const newNotification = await notificationService.create(data)
      const newNotification = {
        notification_id: Date.now(),
        title: data.title,
        message: data.message,
        created_at: new Date().toISOString(),
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
      // await notificationService.delete(id)
      console.log("[FAKE DELETE] Notification ID:", id)
      setNotifications((prev) => prev.filter((n) => n.notification_id !== id))
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
