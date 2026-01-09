import React, { useState, useRef, useEffect, useMemo } from "react"
import { Icon } from "@iconify/react"
import { useAuth } from "@/context/AuthContext"
import { useGetNotificationsQuery } from "@/services/notificationApi"
import NotificationDropdown from "@/features/notification/components/user/NotificationDropdown"
import { AnimatePresence, motion } from "framer-motion"
import { EASING } from "@/shared/components/ui/easing"

const NotificationMenu = ({ onOpen, isOpen, onClose }) => {
  const { isAuthenticated } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef(null)

  // Fetch notifications count for badge (get first page to count unread)
  const { data: notificationsData } = useGetNotificationsQuery(
    { pageNumber: 1, pageSize: 50 },
    {
      skip: !isAuthenticated,
      pollingInterval: 30000,
    }
  )

  // Calculate unread count from transformed response
  const unreadCount = useMemo(() => {
    if (!notificationsData?.items) return 0

    return notificationsData.items.filter(
      (notification) => !(notification.read ?? notification.isRead ?? false)
    ).length
  }, [notificationsData])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      className="notification-container w-[32px] h-[32px] flex"
      ref={notifRef}
    >
      <button
        className="hover:bg-[#F3f3f3] cursor-pointer p-1 border border-[#E5E5E5] border-b-[#D3D3D3] rounded-[5px] bg-white"
        onClick={(e) => {
          e.stopPropagation()
          onOpen?.() // Notify parent to close other dropdowns
          setShowNotifications(!showNotifications)
        }}
        aria-label="Notifications"
      >
        <Icon icon="mdi:bell-outline" width="20" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { duration: 0.5, ease: EASING.fluentOut },
            }}
            exit={{
              y: -10,
              opacity: 0,
              transition: { duration: 0.25, ease: EASING.fluentOut },
            }}
            className="notification-dropdown-wrapper"
          >
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationMenu
