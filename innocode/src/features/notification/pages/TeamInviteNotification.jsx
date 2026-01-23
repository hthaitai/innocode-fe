import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useParams, useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import {
  useGetNotificationByIdQuery,
  useGetNotificationsQuery,
  useReadNotificationMutation,
} from "@/services/notificationApi"
import {
  useAcceptInviteMutation,
  useDeclineInviteMutation,
} from "@/services/teamInviteApi"
import { toast } from "react-hot-toast"

const TeamInviteNotification = () => {
  const { t } = useTranslation("notifications")
  const { notificationId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("idle")
  const [message, setMessage] = useState("")

  // Try to get notification by ID first
  const { data: notificationByIdData, isLoading: isLoadingById } =
    useGetNotificationByIdQuery(notificationId, { skip: !notificationId })

  const { data: notificationsListData, isLoading: isLoadingList } =
    useGetNotificationsQuery(
      { pageNumber: 1, pageSize: 50 },
      {
        skip: !!notificationByIdData,
      },
    )

  const [readNotification] = useReadNotificationMutation()
  const [acceptInvite, { isLoading: isAccepting }] = useAcceptInviteMutation()
  const [declineInvite, { isLoading: isDeclining }] = useDeclineInviteMutation()

  const notificationData = React.useMemo(() => {
    if (notificationByIdData) {
      return notificationByIdData
    }

    if (notificationsListData?.items) {
      return notificationsListData.items.find(
        (notif) => notif.notificationId === notificationId,
      )
    }

    return null
  }, [notificationByIdData, notificationsListData, notificationId])

  const isLoading = isLoadingById || isLoadingList

  const parsedPayload = React.useMemo(() => {
    if (!notificationData) return null

    const notification = notificationData?.data || notificationData
    const payload = notification?.payload

    if (!payload) return null

    try {
      return typeof payload === "string" ? JSON.parse(payload) : payload
    } catch {
      return null
    }
  }, [notificationData])

  // Mark notification as read when component mounts
  useEffect(() => {
    if (notificationId) {
      readNotification(notificationId)
    }
  }, [notificationId, readNotification])

  const handleInviteAction = async (actionType) => {
    const action = parsedPayload?.actions?.[actionType]
    if (!action || loading || isAccepting || isDeclining) return

    setLoading(true)
    setStatus("processing")

    try {
      const { query } = action
      const token = query?.token
      const email = query?.email

      if (!token || !email) {
        throw new Error(t("ui.team_invite.missing_token"))
      }

      const result =
        actionType === "accept"
          ? await acceptInvite({ token, email }).unwrap()
          : await declineInvite({ token, email }).unwrap()

      // Handle success response
      const responseData = result?.data || result
      const successMessage =
        responseData?.message ||
        result?.message ||
        (actionType === "accept"
          ? t("ui.team_invite.success_accepted")
          : t("ui.team_invite.success_declined"))

      setStatus("success")
      setMessage(successMessage)
      toast.success(successMessage)

      setTimeout(
        () => navigate(`/contest-detail/${parsedPayload.contestId}`),
        2000,
      )
    } catch (error) {
      console.error(`❌ ${actionType} invite error:`, error)

      setStatus("error")

      // Extract error information
      const errorData = error?.data || error?.response?.data
      const errorCode = errorData?.errorCode
      const statusCode = error?.status || error?.response?.status

      // Build user-friendly error message
      let errorMessage =
        errorData?.errorMessage ||
        errorData?.message ||
        errorData?.data?.message ||
        error?.message

      setMessage(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptInvite = () => handleInviteAction("accept")

  const handleDeclineInvite = () => handleInviteAction("decline")

  if (isLoading) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.NOTIFICATIONS}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              {t("ui.team_invite.loading")}
            </p>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (!parsedPayload || parsedPayload.targetType !== "team_invite") {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.NOTIFICATIONS}>
        <div className="max-w-md mx-auto mt-12">
          <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
            <Icon
              icon="mdi:alert-circle"
              width="48"
              className="text-red-500 mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t("ui.team_invite.invalid_title")}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("ui.team_invite.invalid_message")}
            </p>
            <button
              onClick={() => navigate("/notifications")}
              className="button-orange"
            >
              {t("ui.team_invite.back_to_notifications")}
            </button>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer breadcrumb={BREADCRUMBS.NOTIFICATIONS}>
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {status === "idle" && (
            <div className="text-center">
              <Icon
                icon="mdi:account-plus"
                width="64"
                className="text-orange-500 mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t("ui.team_invite.title")}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("ui.team_invite.message_default", {
                  teamName:
                    parsedPayload.teamName || t("ui.team_invite.team_fallback"),
                })}
              </p>
              {parsedPayload.contestName && (
                <p className="text-sm text-gray-500 mb-6">
                  {t("ui.team_invite.contest_label")}{" "}
                  {parsedPayload.contestId ? (
                    <button
                      onClick={() =>
                        navigate(`/contest-detail/${parsedPayload.contestId}`)
                      }
                      className="text-orange-500 cursor-pointer hover:text-orange-600 hover:underline font-medium transition-colors"
                    >
                      {parsedPayload.contestName}
                    </button>
                  ) : (
                    <span className="font-medium">
                      {parsedPayload.contestName}
                    </span>
                  )}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleDeclineInvite}
                  disabled={loading}
                  className="button-white flex-1"
                >
                  <Icon icon="mdi:close" width="18" className="inline mr-2" />
                  {t("ui.team_invite.decline")}
                </button>
                <button
                  onClick={handleAcceptInvite}
                  disabled={loading}
                  className="button-orange flex-1"
                >
                  <Icon icon="mdi:check" width="18" className="inline mr-2" />
                  {t("ui.team_invite.accept")}
                </button>
              </div>
            </div>
          )}

          {status === "processing" && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#ff6b35] mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t("ui.team_invite.processing")}
              </h2>
              <p className="text-gray-600">
                {t("ui.team_invite.processing_message")}
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <Icon
                icon="mdi:check-circle"
                width="64"
                className="text-green-500 mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t("ui.team_invite.success_title")}
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <Icon
                icon="mdi:alert-circle"
                width="64"
                className="text-red-500 mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t("ui.team_invite.error_title")}
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <button
                onClick={() => navigate("/notifications")}
                className="button-orange"
              >
                {t("ui.team_invite.back_to_notifications")}
              </button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

export default TeamInviteNotification
