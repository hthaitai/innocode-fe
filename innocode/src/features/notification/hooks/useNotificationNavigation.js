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

    // Manual grading assignment for judges
    if (
      (targetType === "submission" &&
        notification.type === "manual_grading.assigned") ||
      notification.type === "manual_grading.assigned"
    ) {
      if (userRole === "judge") {
        if (onClose) onClose()
        const { contestId, roundId } = notification.parsedPayload || {}

        if (contestId && roundId) {
          // Navigate to judge grading page with contest and round
          navigate(`/judge/contests/${contestId}/rounds/${roundId}/submissions`)
        } else if (contestId) {
          // Fallback to contest grading page if roundId is missing
          navigate(`/judge/contests/${contestId}`)
        } else {
          console.warn(
            "Manual grading assignment notification missing contestId or roundId",
          )
        }
        return
      }
    }
    // Appeal created/updated for organizer
    if (targetType === "appeal" && userRole === "organizer") {
      if (onClose) onClose()
      const { contestId, appealId } = notification.parsedPayload || {}
      navigate(`/organizer/contests/${contestId}/appeals/${appealId}`)
      return
    }

    // Appeal updated/submitted for mentor
    if (
      (targetType === "appeal" ||
        notification.type === "appeal.updated" ||
        notification.type === "appeal.submitted" ||
        notification.type === "AppealUpdated" ||
        notification.type === "NewAppealSubmitted") &&
      userRole === "mentor"
    ) {
      if (onClose) onClose()
      const { contestId } = notification.parsedPayload || {}
      // Navigate to mentor appeal page, optionally with contestId
      if (contestId) {
        navigate(`/appeal/${contestId}`)
      } else {
        navigate("/appeal")
      }
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

    // Submission result available - navigate to contest detail
    if (
      targetType === "submission" ||
      notification.type === "submission.result" ||
      notification.type === "SubmissionResultAvailable"
    ) {
      if (onClose) onClose()
      const { contestId, submissionId, problemId } =
        notification.parsedPayload || {}

      if (contestId) {
        // Navigate to contest detail page for students/mentors
        navigate(`/contest-detail/${contestId}`)
      } else {
        console.warn("Submission result notification missing contestId")
      }
      return
    }

    // Submission plagiarism suspected - navigate to plagiarism detail for organizer
    if (
      notification.type === "submission.plagiarism_suspected" ||
      notification.type === "SubmissionPlagiarismSuspected"
    ) {
      if (onClose) onClose()
      const { contestId, submissionId } = notification.parsedPayload || {}

      if (contestId && submissionId && userRole === "organizer") {
        // Navigate to plagiarism detail page for organizers only
        navigate(`/organizer/contests/${contestId}/plagiarism/${submissionId}`)
      } else if (contestId) {
        // Fallback to contest detail if submission details are missing or not organizer
        navigate(`/contest-detail/${contestId}`)
      }
      return
    }

    // Submission plagiarism confirmed - navigate to plagiarism detail for organizer
    if (
      notification.type === "submission.plagiarism_confirmed" ||
      notification.type === "SubmissionPlagiarismConfirmed"
    ) {
      if (onClose) onClose()
      const { contestId, submissionId } = notification.parsedPayload || {}

      if (contestId && submissionId && userRole === "organizer") {
        // Navigate to plagiarism detail page for organizers only
        navigate(`/leaderboard/${contestId}`)
      } else if (contestId) {
        // Fallback to contest detail if submission details are missing or not organizer
        navigate(`/contest-detail/${contestId}`)
      }
      return
    }

    // Submission status changed - navigate to leaderboard for organizer
    if (
      notification.type === "submission.status_changed" ||
      notification.type === "SubmissionStatusChanged"
    ) {
      if (onClose) onClose()
      const { contestId } = notification.parsedPayload || {}

      if (contestId && userRole === "organizer") {
        // Navigate to leaderboard page for organizers
        navigate(`/leaderboard/${contestId}`)
      } else if (contestId) {
        // Fallback to contest detail if not organizer
        navigate(`/contest-detail/${contestId}`)
      }
      return
    }

    // Round or Contest started/ended notifications - navigate to contest detail
    const message = notification.message || ""
    const notificationType = notification.type || ""
    const lowerMessage = message.toLowerCase()
    const lowerType = notificationType.toLowerCase()

    // Check if notification is about round/contest started or ended
    const isRoundOrContestStarted =
      lowerMessage.includes("has started") ||
      lowerMessage.includes("started") ||
      lowerType.includes("started") ||
      lowerType.includes("round.started") ||
      lowerType.includes("contest.started")

    const isRoundOrContestEnded =
      lowerMessage.includes("has ended") ||
      lowerMessage.includes("ended") ||
      lowerType.includes("ended") ||
      lowerType.includes("round.ended") ||
      lowerType.includes("contest.ended")

    if (
      (isRoundOrContestStarted || isRoundOrContestEnded) &&
      notification.parsedPayload?.contestId
    ) {
      if (onClose) onClose()
      const { contestId } = notification.parsedPayload
      // Navigate to contest detail page
      navigate(`/contest-detail/${contestId}`)
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
