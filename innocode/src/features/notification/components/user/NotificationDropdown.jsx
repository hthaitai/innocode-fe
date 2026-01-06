import React, { useMemo } from "react"
import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useGetNotificationsQuery } from "@/services/notificationApi"
import { formatDateTime } from "@/shared/utils/dateTime"
import "./NotificationDropdown.css"
import {
  useReadAllNotificationsMutation,
} from "../../../../services/notificationApi"
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
        message = rawMessage || notification.payload || tCommon("notification.noMessage")
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
    <div className="notification-dropdown">
      <div className="notification-dropdown-header">
        <h3 className="notification-title">{tCommon("notification.title")}</h3>
        {notifications.length > 0 && (
          <span className="notification-count">
            {
              notifications.filter((notification) => !notification.isRead)
                .length
            }{" "}
            {tCommon("notification.new")}
          </span>
        )}
      </div>

      <div className="notification-list">
        {isLoading ? (
          <div className="notification-loading">
            <Icon icon="mdi:loading" width="20" className="spinning" />
            <span>{tCommon("notification.loading")}</span>
          </div>
        ) : error ? (
          <div className="notification-empty">
            <Icon icon="mdi:alert-circle-outline" width="24" />
            <span>{tCommon("notification.errorLoading")}</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">
            <Icon icon="mdi:bell-off-outline" width="24" />
            <span>{tCommon("notification.noNotifications")}</span>
          </div>
        ) : (
          displayedNotifications.map((notification) => (
            <div
              key={notification.notificationId}
              className="notification-item"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-item-icon">
                <Icon icon="mdi:information-outline" width="20" />
              </div>
              <div className="notification-item-content">
                <div
                  className={`notification-item-message ${
                    !notification.isRead ? "font-bold" : ""
                  }`}
                >
                  {notification.message}
                </div>
                <div className="notification-item-time">
                  {formatDateTime(notification.sentAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with actions */}
      <div className="notification-dropdown-footer">
        {hasMoreNotifications && (
          <button className="notification-view-all" onClick={handleViewAll}>
            <span>{tCommon("notification.viewAll")}</span>
            <Icon icon="mdi:chevron-right" width="16" />
          </button>
        )}
        {notifications.length > 0 && (
          <button
            className="notification-mark-all"
            onClick={handleReadAllNotifications}
          >
            {tCommon("notification.markAllAsRead")}
          </button>
        )}
      </div>
    </div>
  )
}

export default NotificationDropdown
