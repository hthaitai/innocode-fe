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
    const { targetType } = notification.parsedPayload || {}
    const userRole = user?.role

    try {
      await readNotification(notification.notificationId).unwrap()
    } catch (error) {
      console.error("Error reading notification:", error)
    }

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

    // Judge invite for judges
    if (targetType === "judge_invite" && userRole === "judge") {
      if (onClose) onClose()
      const inviteCode = notification.parsedPayload?.inviteCode
      const contestId = notification.parsedPayload?.contestId
      const email = notification.parsedPayload?.email || user?.email

      if (inviteCode) {
        const params = new URLSearchParams({ inviteCode })
        if (contestId) {
          params.append("contestId", contestId)
        }
        if (email) {
          params.append("email", email)
        }
        navigate(`/judge/invite?${params.toString()}`)
      } else {
        console.warn("Judge invite notification missing inviteCode")
      }
      return
    }
    // Appeal created for organizer
    if (targetType === "appeal" && userRole === "organizer") {
      if (onClose) onClose()
      const { contestId, appealId } = notification.parsedPayload || {}
      navigate(`/organizer/contests/${contestId}/appeals/${appealId}`)
      return
    }

    // Contest updates for organizer
    if (targetType === "contest" && userRole === "organizer") {
      if (onClose) onClose()
      const { contestId } = notification.parsedPayload || {}
      navigate(`/organizer/contests/${contestId}`)
      return
    }

    // Judge invitation updates for organizer
    if (targetType === "judge_invite" && userRole === "organizer") {
      if (onClose) onClose()
      const { contestId } = notification.parsedPayload || {}
      navigate(`/organizer/contests/${contestId}/judges`)
      return
    }

    // Team invitation response (accepted/declined) for mentor
    if (
      (targetType === "team_invitation_accepted" ||
        targetType === "team_invitation_declined" ||
        notification.type === "team.invitation_accepted" ||
        notification.type === "team.invitation_declined" ||
        notification.type === "TeamInvitationAccepted" ||
        notification.type === "TeamInvitationDeclined") &&
      userRole === "mentor"
    ) {
      if (onClose) onClose()
      const { contestId } = notification.parsedPayload || {}
      console.log("🎯 Navigating to team page with contestId:", contestId)
      if (contestId) {
        navigate(`/mentor-team/${contestId}`)
      } else {
        // Fallback to my team page if contestId is not available
        navigate("/team")
      }
      return
    }

    // No matching navigation case found
    console.warn("⚠️ No navigation case matched for notification:", {
      targetType,
      notificationType: notification.type,
      userRole,
    })
  }

  return handleNotificationClick
}

export default useNotificationNavigation
