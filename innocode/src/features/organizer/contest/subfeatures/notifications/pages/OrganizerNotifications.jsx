import React from "react"
import { Bell, Eye, Trash2 } from "lucide-react"

import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import Actions from "@/features/contest/components/Actions"
import { useModal } from "@/features/organizer/hooks/useModal"
import useOrganizerNotifications from "../hooks/useOrganizerNotifications"
import { useOrganizerBreadcrumb } from "@/features/organizer/hooks/useOrganizerBreadcrumb"

const OrganizerNotifications = () => {
  const {
    notifications,
    loading,
    error,
    sendNotification,
    deleteNotification,
  } = useOrganizerNotifications()

  const { openModal } = useModal()
  const { breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_NOTIFICATIONS")

  // ----- CRUD Modals -----
  const handleNotificationModal = (mode, notification = {}) => {
    openModal("notification", {
      mode,
      initialData: notification,
      onSubmit: async (data) => {
        if (mode === "create") return await sendNotification(data)
      },
    })
  }

  const handleDeleteNotification = (notification) => {
    openModal("confirmDelete", {
      type: "notification",
      item: notification,
      onConfirm: async (onClose) => {
        await deleteNotification(notification.notification_id)
        onClose()
      },
    })
  }

  // ----- Table Columns -----
  const notificationColumns = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => row.original.type || "—",
    },
    {
      accessorKey: "channel",
      header: "Channel",
      cell: ({ row }) => row.original.channel || "—",
    },
    {
      accessorKey: "payload",
      header: "Message",
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-[300px]">
          {row.original.payload || "—"}
        </span>
      ),
    },
    {
      accessorKey: "sent_at",
      header: "Sent At",
      cell: ({ row }) => new Date(row.original.sent_at).toLocaleString() || "—",
    },
    {
      accessorKey: "sent_by",
      header: "Sent By",
      cell: ({ row }) => row.original.sent_by || "System",
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <Actions
          row={row.original}
          items={[
            {
              label: "View",
              icon: Eye,
              onClick: () =>
                openModal("notificationDetail", { notification: row.original }),
            },
            {
              label: "Delete",
              icon: Trash2,
              className: "text-red-500",
              onClick: () => handleDeleteNotification(row.original),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      loading={loading}
      error={error}
    >
      <div className="space-y-1">
        {/* Header */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <Bell size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">Notifications</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                View and send notifications to participants
              </p>
            </div>
          </div>
          <button
            className="button-orange"
            onClick={() => handleNotificationModal("create")}
          >
            Send Notification
          </button>
        </div>

        {/* Notifications Table */}
        <TableFluent
          data={notifications}
          columns={notificationColumns}
          title="Notifications"
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerNotifications
