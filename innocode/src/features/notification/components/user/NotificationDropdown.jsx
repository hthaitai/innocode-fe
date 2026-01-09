import React, { useMemo } from "react"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useGetNotificationsQuery } from "@/services/notificationApi"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useReadAllNotificationsMutation } from "../../../../services/notificationApi"
import useNotificationNavigation from "../../hooks/useNotificationNavigation"
import {
  buildInterpolationValues,
  parseNotificationPayload,
  getTranslationKey,
} from "../../utils/notificationUtils"

const NotificationDropdown = ({ onClose }) => {
  const navigate = useNavigate()
  const { t: tCommon } = useTranslation("common")
  const { t: tNotifications } = useTranslation("notifications")
  const {
    data: notificationsData,
    isLoading,
    error,
  } = useGetNotificationsQuery(
    { pageNumber: 1, pageSize: 10 },
    {
      pollingInterval: 30000,
    }
  )

  const [readAllNotifications] = useReadAllNotificationsMutation()
  const handleNotificationClick = useNotificationNavigation(onClose)

  const notifications = useMemo(() => {
    if (!notificationsData?.items) return []

    return notificationsData.items.map((notification) => {
      const parsedPayload = parseNotificationPayload(notification)
      const translationKey = getTranslationKey(notification, parsedPayload)
      const rawMessage = parsedPayload.message || notification.message || ""

      let message = tCommon("notification.noMessage")
      if (translationKey) {
        const interpolationValues = buildInterpolationValues(
          parsedPayload,
          translationKey,
          rawMessage
        )

        message = tNotifications(translationKey, {
          ...interpolationValues,
          defaultValue: rawMessage || tCommon("notification.noMessage"),
        })
      } else {
        message =
          rawMessage ||
          notification.payload ||
          tCommon("notification.noMessage")
      }

      return {
        ...notification,
        parsedPayload,
        message,
        isRead: notification.read ?? notification.isRead ?? false,
      }
    })
  }, [notificationsData, tCommon, tNotifications])

  const handleReadAllNotifications = async () => {
    try {
      await readAllNotifications().unwrap()
    } catch (error) {
      console.error("Error reading all notifications:", error)
    }
  }

  // Limit to first 3 notifications
  const displayedNotifications = useMemo(() => {
    return notifications.slice(0, 3)
  }, [notifications])

  // Check if there are more notifications
  const hasMoreNotifications = notifications.length > 3

  // Handle view all - navigate to notifications page
  const handleViewAll = () => {
    if (onClose) {
      onClose()
    }
    navigate("/notifications")
  }

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[5px] shadow-lg w-[380px] max-h-[500px] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white z-10">
        <h3 className="text-subtitle-2 text-[#18181B] m-0">
          {tCommon("notification.title")}
        </h3>
        {notifications.length > 0 && (
          <span className="text-caption-1-strong text-[#E05307]">
            {
              notifications.filter((notification) => !notification.isRead)
                .length
            }{" "}
            {tCommon("notification.new")}
          </span>
        )}
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center p-8 gap-3 text-[#A1A1AA] text-body-1">
            <Icon icon="mdi:loading" width="20" className="animate-spin" />
            <span>{tCommon("notification.loading")}</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 gap-2 text-[#EF4444] text-body-1">
            <Icon icon="mdi:alert-circle-outline" width="24" />
            <span>{tCommon("notification.errorLoading")}</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 gap-2 text-[#A1A1AA] text-body-1">
            <Icon icon="mdi:bell-off-outline" width="24" />
            <span>{tCommon("notification.noNotifications")}</span>
          </div>
        ) : (
          displayedNotifications.map((notification) => (
            <div
              key={notification.notificationId}
              className="flex gap-3 p-4 border-b border-[#F3F3F3] cursor-pointer transition-colors duration-150 last:border-b-0 hover:bg-[#F9FAFB]"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex-shrink-0 mt-0.5 text-[#52525B]">
                <Icon
                  icon={
                    !notification.isRead
                      ? "mdi:email-mark-as-unread"
                      : "mdi:email-open-outline"
                  }
                  width="20"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div
                  className={`text-body-1 text-[#18181B] break-words line-clamp-2 ${
                    !notification.isRead ? "text-body-1-strong" : ""
                  }`}
                >
                  {notification.message}
                </div>
                <div className="text-caption-1 text-[#A1A1AA]">
                  {formatDateTime(notification.sentAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with actions */}
      {(hasMoreNotifications || notifications.length > 0) && (
        <div className="p-3 border-t border-[#E5E5E5] flex justify-between items-center bg-[#FAFAFA]">
          {hasMoreNotifications && (
            <button
              className="flex items-center gap-1 bg-transparent border-none text-[#E05307] text-caption-1-strong cursor-pointer hover:underline p-1"
              onClick={handleViewAll}
            >
              <span>{tCommon("notification.viewAll")}</span>
              <Icon icon="mdi:chevron-right" width="16" />
            </button>
          )}
          {notifications.length > 0 && (
            <button
              className={`bg-transparent border-none text-[#52525B] text-caption-1 cursor-pointer hover:text-[#18181B] p-1 ml-auto transition-colors`}
              onClick={handleReadAllNotifications}
            >
              {tCommon("notification.markAllAsRead")}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
