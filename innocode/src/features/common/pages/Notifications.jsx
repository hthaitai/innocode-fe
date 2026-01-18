import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import {
  useGetNotificationsQuery,
  useReadAllNotificationsMutation,
  useReadNotificationMutation,
  useGetUnreadCountQuery,
} from "@/services/notificationApi"
import { formatDateTime } from "@/shared/utils/dateTime"
import { toast } from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"
import TablePagination from "@/shared/components/TablePagination"
import useNotificationNavigation from "../../notification/hooks/useNotificationNavigation"
import { AnimatedSection } from "../../../shared/components/ui/AnimatedSection"
import { ChevronRight, Mail } from "lucide-react"
import {
  buildInterpolationValues,
  parseNotificationPayload,
  getTranslationKey,
} from "../../notification/utils/notificationUtils"

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
    },
  )

  // Get total unread count from dedicated API
  const { data: totalUnreadCount = 0 } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000,
  })

  // Display count with 99+ handling
  const displayUnreadCount = totalUnreadCount > 99 ? "99+" : totalUnreadCount

  const [readNotification] = useReadNotificationMutation()
  const [readAllNotifications] = useReadAllNotificationsMutation()

  const { t } = useTranslation("notifications")

  const notifications = useMemo(() => {
    if (!notificationsData?.items) return []

    return notificationsData.items.map((notification) => {
      const parsedPayload = parseNotificationPayload(notification)
      const translationKey = getTranslationKey(notification, parsedPayload)
      const rawMessage = parsedPayload.message || notification.message || ""

      let message = "No message"
      if (translationKey) {
        const interpolationValues = buildInterpolationValues(
          parsedPayload,
          translationKey,
          rawMessage,
        )

        message = t(translationKey, {
          ...interpolationValues,
          defaultValue: rawMessage || "No message",
        })
      } else {
        message = rawMessage || notification.payload || "No message"
      }

      return {
        ...notification,
        parsedPayload,
        message,
        isRead: notification.read ?? notification.isRead ?? false,
      }
    })
  }, [notificationsData, t])

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
    [notifications],
  )

  const handleNotificationClick = useNotificationNavigation()

  const handleReadAllNotifications = async () => {
    try {
      await readAllNotifications().unwrap()
    } catch (error) {
      console.error("Error reading all notifications:", error)
      toast.error("Failed to mark all notifications as read")
    }
  }

  const canMarkAllAsRead = totalUnreadCount > 0

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
            {t("ui.empty")}
          </p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      AnimatedSection
      breadcrumb={BREADCRUMBS.NOTIFICATIONS}
      loading={isLoading}
      error={error}
    >
      <AnimatedSection direction="bottom">
        {" "}
        <div className="space-y-1">
          {/* Header */}
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-4 flex justify-between items-center">
            <div className="flex gap-5 items-center">
              <Icon icon="mdi:bell-outline" width={20} />
              <div>
                <p className="text-[14px] leading-[20px]">{t("ui.title")}</p>
                <p className="text-[12px] leading-[16px] text-[#7A7574]">
                  {totalUnreadCount > 0
                    ? t("ui.unreadCount", { count: displayUnreadCount })
                    : t("ui.allRead")}
                </p>
              </div>
            </div>

            <button
              className={`px-3 ${
                totalUnreadCount > 0 ? "button-orange" : "button-gray"
              }`}
              onClick={handleMarkAllClick}
            >
              {t("ui.markAllAsRead")}
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
                  <Mail
                    size={20}
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

                <div className="flex items-center gap-3">
                  {!notification.isRead && (
                    <div className="w-1.5 h-1.5 bg-[#E05307] rounded-full"></div>
                  )}
                  <ChevronRight size={20} className="text-[#7A7574]" />
                </div>
              </div>
            ))}
          </div>

          {pagination && (
            <TablePagination pagination={pagination} onPageChange={setPage} />
          )}
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default Notifications
