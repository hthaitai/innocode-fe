import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import PageContainer from "@/shared/components/PageContainer";
import { BREADCRUMBS } from "@/config/breadcrumbs";
import {
  useGetNotificationsQuery,
  useReadNotificationMutation,
  useReadAllNotificationsMutation,
} from "@/services/notificationApi";
import { formatDateTime } from "@/shared/utils/dateTime";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import TablePagination from "@/shared/components/TablePagination";

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const {
    data: notificationsData,
    isLoading,
    error,
  } = useGetNotificationsQuery(
    { pageNumber: page, pageSize },
    {
      pollingInterval: 30000,
    }
  );

  const [readNotification] = useReadNotificationMutation();
  const [readAllNotifications] = useReadAllNotificationsMutation();

  const notifications = useMemo(() => {
    if (!notificationsData?.items) return [];

    return notificationsData.items.map((notification) => {
      let parsedPayload = {};
      let message = "No message";

      try {
        parsedPayload =
          typeof notification.payload === "string"
            ? JSON.parse(notification.payload)
            : notification.payload || {};
        message = parsedPayload.message || notification.payload || "No message";
      } catch {
        message = notification.payload || "No message";
      }

      return {
        ...notification,
        parsedPayload,
        message,
        isRead: notification.read ?? notification.isRead ?? false,
      };
    });
  }, [notificationsData]);

  // Build pagination object for TablePagination component
  const pagination = useMemo(() => {
    if (!notificationsData) return null;
    return {
      pageNumber: notificationsData.pageNumber || 1,
      pageSize: notificationsData.pageSize || pageSize,
      totalPages: notificationsData.totalPages || 1,
      totalCount: notificationsData.totalCount || 0,
      hasPreviousPage: notificationsData.hasPreviousPage || false,
      hasNextPage: notificationsData.hasNextPage || false,
    };
  }, [notificationsData, pageSize]);

  const unreadCount = useMemo(
    () => notifications.filter((notif) => !notif.isRead).length,
    [notifications]
  );

  const handleNotificationClick = async (notification) => {
    try {
      await readNotification(notification.notificationId).unwrap();
    } catch (error) {
      console.error("Error reading notification:", error);
    }

    if (
      notification.parsedPayload?.targetType === "team_invite" &&
      user?.role === "student"
    ) {
      navigate(`/notifications/team-invite/${notification.notificationId}`);
    }
  };

  const handleReadAllNotifications = async () => {
    try {
      await readAllNotifications().unwrap();
    } catch (error) {
      console.error("Error reading all notifications:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  return (
    <PageContainer breadcrumb={BREADCRUMBS.NOTIFICATIONS}>
      <div className="space-y-4">
        {/* Header */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-4 flex justify-between items-center">
          <div className="flex gap-5 items-center">
            <Icon icon="mdi:bell-outline" width={24} />
            <div>
              <p className="text-[14px] leading-[20px] font-semibold">
                Notifications
              </p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1 ? "s" : ""
                    }`
                  : "All notifications read"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              className="button-orange text-sm"
              onClick={handleReadAllNotifications}
            >
              <Icon icon="mdi:check-all" width={16} className="inline mr-2" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Icon icon="mdi:loading" width={24} className="spinning mr-2" />
              <span className="text-gray-600">Loading notifications...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon
                icon="mdi:alert-circle-outline"
                width={48}
                className="text-red-500 mb-2"
              />
              <span className="text-gray-600">Error loading notifications</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon
                icon="mdi:bell-off-outline"
                width={48}
                className="text-gray-400 mb-2"
              />
              <span className="text-gray-600">No notifications</span>
            </div>
          ) : (
            <>
              <div className="divide-y divide-[#E5E5E5]">
                {notifications.map((notification) => (
                  <div
                    key={notification.notificationId}
                    className={`px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? "bg-gray-100 border-l-4 " : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Icon
                          icon={"mdi:information-outline"}
                          width={24}
                          className={`${
                            !notification.isRead ? "" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm mb-1 ${
                            !notification.isRead
                              ? "font-semibold text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDateTime(notification.sentAt)}
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {pagination && (
                <div className="px-5 py-4 border-t border-[#E5E5E5]">
                  <TablePagination
                    pagination={pagination}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Notifications;
