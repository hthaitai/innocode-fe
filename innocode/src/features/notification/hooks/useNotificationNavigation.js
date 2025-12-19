import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useReadNotificationMutation } from "@/services/notificationApi"

/**
 * Custom hook để xử lý navigation khi click vào notification
 * @param {Function} onClose - Optional callback để đóng dropdown/modal khi navigate
 * @returns {Function} handleNotificationClick - Function để xử lý click vào notification
 */
const useNotificationNavigation = (onClose) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [readNotification] = useReadNotificationMutation()

  const handleNotificationClick = async (notification) => {
    try {
      await readNotification(notification.notificationId).unwrap()
    } catch (error) {
      console.error("Error reading notification:", error)
    }

    const { targetType } = notification.parsedPayload || {}
    const userRole = user?.role

    // Team invite for students
    if (targetType === "team_invite" && userRole === "student") {
      if (onClose) onClose()
      navigate(`/notifications/team-invite/${notification.notificationId}`)
      return
    }

    // School creation request for staff
    if (targetType === "school_creation_request" && userRole === "staff") {
      if (onClose) onClose()
      navigate(`/school-staff/${notification.parsedPayload?.requestId}`)
      return
    }

    // School or school creation request for school manager
    if (
      (targetType === "school" || targetType === "school_creation_request") &&
      userRole === "schoolmanager"
    ) {
      if (onClose) onClose()
      navigate(`/school-requests/${notification.parsedPayload?.requestId}`)
      return
    }
  }

  return handleNotificationClick
}

export default useNotificationNavigation

