import React, { useMemo } from "react"
import { Icon } from "@iconify/react"
import { useGetNotificationsQuery } from "@/services/notificationApi"
import { formatDateTime } from "@/shared/utils/dateTime"
import "./NotificationDropdown.css"

const NotificationDropdown = () => {
  const {
    data: notificationsData,
    isLoading,
    error,
  } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000, // Poll every 30 seconds
  })

  // Parse notifications and extract message from payload
  const notifications = useMemo(() => {
    if (!notificationsData?.data?.items) return []

    return notificationsData.data.items.map((notification) => {
      let parsedPayload = {}
      let message = "No message"

      try {
        parsedPayload =
          typeof notification.payload === "string"
            ? JSON.parse(notification.payload)
            : notification.payload || {}
        message = parsedPayload.message || notification.payload || "No message"
      } catch (e) {
        message = notification.payload || "No message"
      }

      return {
        ...notification,
        parsedPayload,
        message,
      }
    })
  }, [notificationsData])

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "team.invitation":
        return "mdi:account-plus-outline"
      case "round_opened":
        return "mdi:play-circle-outline"
      case "result_published":
        return "mdi:chart-line"
      default:
        return "mdi:information-outline"
    }
  }

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown-header">
        <h3 className="notification-title">Notifications</h3>
        {notifications.length > 0 && (
          <span className="notification-count">{notifications.length} new</span>
        )}
      </div>

      <div className="notification-list">
        {isLoading ? (
          <div className="notification-loading">
            <Icon icon="mdi:loading" width="20" className="spinning" />
            <span>Loading...</span>
          </div>
        ) : error ? (
          <div className="notification-empty">
            <Icon icon="mdi:alert-circle-outline" width="24" />
            <span>Error loading notifications</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">
            <Icon icon="mdi:bell-off-outline" width="24" />
            <span>No notifications</span>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.notificationId}
              className="notification-item"
            >
              <div className="notification-item-icon">
                <Icon
                  icon={getNotificationIcon(notification.type)}
                  width="20"
                />
              </div>
              <div className="notification-item-content">
                <div className="notification-item-message">
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
    </div>
  )
}

export default NotificationDropdown
