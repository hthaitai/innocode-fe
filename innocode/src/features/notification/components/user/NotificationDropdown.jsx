import React, { useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useGetNotificationsQuery } from "@/services/notificationApi";
import { formatDateTime } from "@/shared/utils/dateTime";
import "./NotificationDropdown.css";
import {
  useReadAllNotificationsMutation,
  useReadNotificationMutation,
} from "../../../../services/notificationApi";

const NotificationDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const {
    data: notificationsData,
    isLoading,
    error,
  } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000, // Poll every 30 seconds
  });
  
  const [readNotification] = useReadNotificationMutation();
  const [readAllNotifications] = useReadAllNotificationsMutation();
  const handleReadNotification = async (notificationId) => {
    try {
      await readNotification(notificationId);
    } catch (error) {
      console.error("Error reading notification:", error);
    }
  };
  const handleReadAllNotifications = async () => {
    try {
      await readAllNotifications();
    } catch (error) {
      console.error("Error reading all notifications:", error);
    }
  };
  // Parse notifications and extract message from payload
  const notifications = useMemo(() => {
    if (!notificationsData?.data?.items) return [];

    return notificationsData.data.items.map((notification) => {
      let parsedPayload = {};
      let message = "No message";

      try {
        parsedPayload =
          typeof notification.payload === "string"
            ? JSON.parse(notification.payload)
            : notification.payload || {};
        message = parsedPayload.message || notification.payload || "No message";
      } catch (e) {
        message = notification.payload || "No message";
      }

      return {
        ...notification,
        parsedPayload,
        message,
      };
    });
  }, [notificationsData]);

  // Limit to first 3 notifications
  const displayedNotifications = useMemo(() => {
    return notifications.slice(0, 3);
  }, [notifications]);

  // Check if there are more notifications
  const hasMoreNotifications = notifications.length > 3;

  // Handle view all - navigate to notifications page
  const handleViewAll = () => {
    if (onClose) {
      onClose();
    }
    navigate("/notifications");
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown-header">
        <h3 className="notification-title">Notifications</h3>
        {notifications.length > 0 && (
          <span className="notification-count">
            {notifications.filter((notification) => !notification.isRead).length}{" "}
            new
          </span>
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
          displayedNotifications.map((notification) => (
            <div
              key={notification.notificationId}
              className="notification-item"
              onClick={() =>
                handleReadNotification(notification.notificationId)
              }
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
          <button
            className="notification-view-all"
            onClick={handleViewAll}
          >
            <span>View all</span>
            <Icon icon="mdi:chevron-right" width="16" />
          </button>
        )}
        {notifications.length > 0 && (
          <button
            className="notification-mark-all"
            onClick={handleReadAllNotifications}
          >
            Mark all as read
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
