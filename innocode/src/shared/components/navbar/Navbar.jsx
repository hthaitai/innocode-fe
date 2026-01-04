import React, { useState, useRef, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import "./Navbar.css"
import InnoCodeLogo from "@/assets/InnoCode_Logo.jpg"
import { useAuth } from "@/context/AuthContext"
import { Icon } from "@iconify/react"
import NotificationDropdown from "@/features/notification/components/user/NotificationDropdown"
import { useGetNotificationsQuery } from "@/services/notificationApi"
import LanguageSwitcher from "@/shared/components/LanguageSwitcher"

const Navbar = () => {
  const navigate = useNavigate()
  const { t } = useTranslation("common")
  const { user, logout, isAuthenticated } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef(null)
  const notifRef = useRef(null)
  const rolesToHideNav = [""] // hide nav links for students

  // Fetch notifications count for badge (get first page to count unread)
  const { data: notificationsData } = useGetNotificationsQuery(
    { pageNumber: 1, pageSize: 50 },
    {
      skip: !isAuthenticated,
      pollingInterval: 30000,
    }
  )

  // Calculate unread count from transformed response
  const unreadCount = React.useMemo(() => {
    if (!notificationsData?.items) return 0

    return notificationsData.items.filter(
      (notification) => !(notification.read ?? notification.isRead ?? false)
    ).length
  }, [notificationsData])

  const handleSignIn = () => {
    navigate("/login")
  }

  const handleLogout = () => {
    setShowDropdown(false)
    setShowNotifications(false)
    logout()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInProfile = dropdownRef.current?.contains(event.target)
      const clickedInNotification = notifRef.current?.contains(event.target)

      // Chỉ đóng dropdowns khi click bên ngoài cả hai
      if (!clickedInProfile && !clickedInNotification) {
        setShowDropdown(false)
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Xác định link Contests dựa theo role
  const getContestsLink = () => {
    if (!isAuthenticated || !user) return "/contests"

    switch (user.role) {
      case "organizer":
        return "/organizer/contests"
      case "student":
      case "judge":
      case "admin":
      default:
        return "/contests"
    }
  }

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return ""
    return user.name || user.email?.split("@")[0] || "User"
  }

  // Get role badge color
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "role-badge-admin"
      case "organizer":
        return "role-badge-organizer"
      case "student":
        return "role-badge-student"
      case "judge":
        return "role-badge-judge"
      default:
        return "role-badge-default"
    }
  }

  const navLinks = [
    { name: t("navbar.home"), key: "home", to: "/" },
    { name: t("navbar.contests"), key: "contests", to: getContestsLink() },
    { name: t("navbar.leaderboard"), key: "leaderboard", to: "/leaderboard" },
    { name: t("navbar.about"), key: "about", to: "/about" },
    { name: t("navbar.policy"), key: "policy", to: "/policy" },
  ]

  return (
    <nav className="h-[64px] top-0 bg-white fixed z-50 w-full flex items-center justify-between px-5">
      {/* Left side: Logo */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Link to="/">
            <img
              src={InnoCodeLogo}
              alt="InnoCode"
              className="w-[50px] h-[50px] object-contain"
            />
          </Link>
        </div>
      </div>

      {/* Navigation Menu */}
      {!rolesToHideNav.includes(user?.role) && (
        <div className="flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 text-sm leading-5 font-medium text-gray-700 hover:text-orange-600 ${
                  isActive ? "text-orange-600 font-semibold" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        {/* Auth Button / User Menu */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-menu" ref={dropdownRef}>
              {/* Notification Bell */}
              <div className="notification-container flex" ref={notifRef}>
                <button
                  className="hover:bg-[#F3f3f3] cursor-pointer p-1 border border-[#E5E5E5] rounded-[5px] bg-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDropdown(false) // Tắt profile dropdown khi mở notification
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
                {showNotifications && (
                  <div className="notification-dropdown-wrapper">
                    <NotificationDropdown
                      onClose={() => setShowNotifications(false)}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowNotifications(false) // Tắt notification dropdown khi mở profile
                  setShowDropdown(!showDropdown)
                }}
              >
                <Icon
                  icon="mdi:account-circle"
                  width="32"
                  className="cursor-pointer"
                />
              </button>

              {showDropdown && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-info">
                      <div className="user-info-name">
                        {getUserDisplayName()}
                      </div>
                      <div className="user-info-email">{user.email}</div>
                      <span
                        className={`role-badge ${getRoleBadgeClass(user.role)}`}
                      >
                        {t(`roles.${user.role}`)}
                      </span>
                    </div>
                  </div>

                  <div className="user-dropdown-divider"></div>

                  <div className="user-dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate("/profile")
                        setShowDropdown(false)
                      }}
                    >
                      <Icon icon="mdi:account" width="18" />
                      <span>{t("navbar.profile")}</span>
                    </button>
                  </div>

                  <div className="user-dropdown-divider"></div>

                  <div className="user-dropdown-menu">
                    <button
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <Icon icon="mdi:logout" width="18" />
                      <span>{t("navbar.logout")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="signin-btn" onClick={handleSignIn}>
              {t("navbar.signIn")}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
