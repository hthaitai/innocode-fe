import { useState, useEffect, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Icon } from "@iconify/react"
import PageContainer from "@/shared/components/PageContainer"
import {
  useAcceptJudgeInviteMutation,
  useDeclineJudgeInviteMutation,
} from "@/services/contestJudgeApi"
import { toast } from "react-hot-toast"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useAuth } from "@/context/AuthContext"

const JudgeInviteResponse = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("idle") // idle, processing, success, error
  const [message, setMessage] = useState("")
  const [action, setAction] = useState(null) // 'accept' or 'decline'
  const inviteCode = searchParams.get("inviteCode")
  const emailParam = searchParams.get("email")
  const hasProcessed = useRef(false)

  // Get email from URL params or user context
  // Decode email if it's URL encoded (searchParams.get should handle this, but ensure it's a string)
  const email = emailParam ? decodeURIComponent(emailParam) : null
  const judgeEmail = email || user?.email

  const [acceptInvite] = useAcceptJudgeInviteMutation()
  const [declineInvite] = useDeclineJudgeInviteMutation()

  // Try to get contest info if we have contestId in the URL or can infer it
  // For now, we'll work with just the inviteCode
  const contestId = searchParams.get("contestId")
  const { data: contest } = useGetContestByIdQuery(contestId, {
    skip: !contestId,
  })

  const handleAcceptInvite = async () => {
    if (!inviteCode || !judgeEmail || hasProcessed.current) return
    hasProcessed.current = true
    setLoading(true)
    setStatus("processing")
    setAction("accept")

    try {
      await acceptInvite({ inviteCode, email: judgeEmail }).unwrap()
      setStatus("success")
      setMessage("Invitation accepted successfully! You are now a judge for this contest.")
      
      toast.success("Invitation accepted successfully!")
      
      // Auto redirect after 2 seconds
      setTimeout(() => {
        navigate("/judge/manual-submissions")
      }, 2000)
    } catch (error) {
      console.error("Error accepting invite:", error)
      setStatus("error")
      
      const errorMessage =
        error?.data?.message ||
        error?.data?.errorMessage ||
        (error?.status === 400
          ? "Invalid invitation. It may have expired or already been processed."
          : error?.status === 404
          ? "Invitation not found. It may have been revoked or expired."
          : "Failed to accept invitation. Please try again.")
      
      setMessage(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDeclineInvite = async () => {
    if (!inviteCode || !judgeEmail || hasProcessed.current) return
    hasProcessed.current = true
    setLoading(true)
    setStatus("processing")
    setAction("decline")

    try {
      await declineInvite({ inviteCode, email: judgeEmail }).unwrap()
      setStatus("success")
      setMessage("Invitation declined successfully.")
      
      toast.success("Invitation declined.")
      
      // Auto redirect after 2 seconds
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (error) {
      console.error("Error declining invite:", error)
      setStatus("error")
      
      const errorMessage =
        error?.data?.message ||
        error?.data?.errorMessage ||
        (error?.status === 400
          ? "Invalid invitation. It may have expired or already been processed."
          : error?.status === 404
          ? "Invitation not found. It may have been revoked or expired."
          : "Failed to decline invitation. Please try again.")
      
      setMessage(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Auto-process if action is in URL (for email links)
  useEffect(() => {
    if (hasProcessed.current || !judgeEmail) return

    const urlAction = searchParams.get("action")
    if (urlAction === "accept" && inviteCode) {
      handleAcceptInvite()
    } else if (urlAction === "decline" && inviteCode) {
      handleDeclineInvite()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteCode, judgeEmail])

  // Show error if no invite code
  if (!inviteCode && status === "idle") {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto mt-12">
          <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
            <Icon
              icon="mdi:alert-circle"
              width="48"
              className="text-red-500 mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Invalid Invitation
            </h2>
            <p className="text-gray-600 mb-4">
              No invitation code provided. Please use the link from your invitation email or notification.
            </p>
            <button onClick={() => navigate("/")} className="button-orange">
              Go to Home
            </button>
          </div>
        </div>
      </PageContainer>
    )
  }

  // Show error if no email
  if (!judgeEmail && status === "idle") {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto mt-12">
          <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
            <Icon
              icon="mdi:alert-circle"
              width="48"
              className="text-red-500 mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Email Required
            </h2>
            <p className="text-gray-600 mb-4">
              Email is required to process this invitation. Please ensure you are logged in or provide your email in the invitation link.
            </p>
            <button onClick={() => navigate("/")} className="button-orange">
              Go to Home
            </button>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Processing state */}
          {status === "processing" && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#ff6b35] mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Processing...
              </h2>
              <p className="text-gray-600">
                Please wait while we process your {action === "accept" ? "acceptance" : "decline"}.
              </p>
            </div>
          )}

          {/* Success state */}
          {status === "success" && (
            <div className="text-center">
              <Icon
                icon="mdi:check-circle"
                width="64"
                className="text-green-500 mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Success!
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting...</p>
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div className="text-center">
              <Icon
                icon="mdi:alert-circle"
                width="64"
                className="text-red-500 mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Error
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => navigate("/")} className="button-gray">
                  Go to Home
                </button>
                {inviteCode && (
                  <button
                    onClick={() => {
                      hasProcessed.current = false
                      setStatus("idle")
                      setMessage("")
                    }}
                    className="button-orange"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Idle state - show invite details and buttons */}
          {status === "idle" && inviteCode && judgeEmail && (
            <div className="text-center">
              <Icon
                icon="mdi:account-tie"
                width="64"
                className="text-[#ff6b35] mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Judge Invitation
              </h2>
              {contest && (
                <div className="mb-4">
                  <p className="text-gray-700 font-medium">{contest.name}</p>
                  {contest.year && (
                    <p className="text-sm text-gray-500">Year: {contest.year}</p>
                  )}
                </div>
              )}
              <p className="text-gray-600 mb-6">
                You have been invited to judge this contest. Would you like to accept or decline this invitation?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleDeclineInvite}
                  disabled={loading}
                  className="button-gray"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptInvite}
                  disabled={loading}
                  className="button-orange"
                >
                  Accept
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

export default JudgeInviteResponse

