import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import {
  useGetNotificationsQuery,
  useReadNotificationMutation,
  useReadAllNotificationsMutation,
} from "@/services/notificationApi"
import { formatDateTime } from "@/shared/utils/dateTime"
import { toast } from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"
import TablePagination from "@/shared/components/TablePagination"

const Notifications = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const pageSize = 8

  const {
    data: notificationsData,
    isLoading,
    error,
  } = useGetNotificationsQuery(
    { pageNumber: page, pageSize },
    {
      pollingInterval: 30000,
    }
  )

  const [readNotification] = useReadNotificationMutation()
  const [readAllNotifications] = useReadAllNotificationsMutation()

  const notifications = useMemo(() => {
    if (!notificationsData?.items) return []

    return notificationsData.items.map((notification) => {
      let parsedPayload = {}
      let message = "No message"

      try {
        parsedPayload =
          typeof notification.payload === "string"
            ? JSON.parse(notification.payload)
            : notification.payload || {}
        message = parsedPayload.message || notification.payload || "No message"
      } catch {
        message = notification.payload || "No message"
      }

      return {
        ...notification,
        parsedPayload,
        message,
        isRead: notification.read ?? notification.isRead ?? false,
      }
    })
  }, [notificationsData])

  // Build pagination object for TablePagination component
  const pagination = useMemo(() => {
    if (!notificationsData) return null
    return {
      pageNumber: notificationsData.pageNumber || 1,
      pageSize: notificationsData.pageSize || pageSize,
      totalPages: notificationsData.totalPages || 1,
      totalCount: notificationsData.totalCount || 0,
      hasPreviousPage: notificationsData.hasPreviousPage || false,
      hasNextPage: notificationsData.hasNextPage || false,
    }
  }, [notificationsData, pageSize])

  const unreadCount = useMemo(
    () => notifications.filter((notif) => !notif.isRead).length,
    [notifications]
  )

  const handleNotificationClick = async (notification) => {
    try {
      await readNotification(notification.notificationId).unwrap()
    } catch (error) {
      console.error("Error reading notification:", error)
    }

    if (
      notification.parsedPayload?.targetType === "team_invite" &&
      user?.role === "student"
    ) {
      navigate(`/notifications/team-invite/${notification.notificationId}`)
    }
  }

  const handleReadAllNotifications = async () => {
    try {
      await readAllNotifications().unwrap()
    } catch (error) {
      console.error("Error reading all notifications:", error)
      toast.error("Failed to mark all notifications as read")
    }
  }

  const canMarkAllAsRead = unreadCount > 0

  const handleMarkAllClick = () => {
    if (!canMarkAllAsRead) return
    handleReadAllNotifications()
  }

  // Early return: no notifications at all
  if (!isLoading && !error && notifications.length === 0) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.NOTIFICATIONS}>
        <div className=" border border-[#E5E5E5] rounded-[5px] bg-white flex items-center justify-center px-5 min-h-[70px]">
          <p className=" text-[12px] leading-[16px] text-[#7A7574]">
            No notifications.
          </p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={BREADCRUMBS.NOTIFICATIONS}
      loading={isLoading}
      error={error}
    >
      <div className="space-y-1">
        {/* Header */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-4 flex justify-between items-center">
          <div className="flex gap-5 items-center">
            <Icon icon="mdi:bell-outline" width={20} />
            <div>
              <p className="text-[14px] leading-[20px]">Notifications</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1 ? "s" : ""
                    }`
                  : "All notifications read"}
              </p>
            </div>
          </div>

          <button
            className={`px-3 ${
              unreadCount > 0 ? "button-orange" : "button-gray"
            }`}
            onClick={handleMarkAllClick}
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-1">
          {notifications.map((notification) => (
            <div
              key={notification.notificationId}
              className={`flex items-center justify-between px-5 min-h-[70px] border border-[#E5E5E5] rounded-[5px] bg-white hover:bg-[#F6F6F6] transition-colors cursor-pointer ${
                !notification.isRead ? "" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-center gap-5">
                <Icon
                  icon={"mdi:information-outline"}
                  width={20}
                  className={`${!notification.isRead ? "" : "text-gray-400"}`}
                />

                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm leading-5 ${
                      !notification.isRead ? "font-semibold" : ""
                    }`}
                  >
                    {notification.message}
                  </div>
                  <div className="text-xs leading-4 text-[#7A7574]">
                    {formatDateTime(notification.sentAt)}
                  </div>
                </div>
              </div>

              {!notification.isRead && (
                <div className="w-1.5 h-1.5 bg-[#E05307] rounded-full"></div>
              )}
            </div>
          ))}
        </div>

        {pagination && (
          <TablePagination pagination={pagination} onPageChange={setPage} />
        )}
      </div>
    </PageContainer>
  )
}

export default Notifications
