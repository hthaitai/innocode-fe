import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify/react"
import { useAuth } from "@/context/AuthContext"
import { toast } from "react-hot-toast"
import ConfirmModal from "@/shared/components/ConfirmModal"
import { AnimatePresence, motion } from "framer-motion"
import { EASING } from "@/shared/components/ui/easing"

const ProfileMenu = ({ onOpen }) => {
  const navigate = useNavigate()
  const { t } = useTranslation("common")
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = () => {
    setShowDropdown(false)
    setShowLogoutModal(true)
  }

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      toast.success(t("auth.logoutSuccess"))
    } catch (error) {
      toast.error(t("common.error"))
    } finally {
      setIsLoggingOut(false)
      setShowLogoutModal(false)
    }
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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

  return (
    <div className="user-menu" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onOpen?.() // Notify parent/siblings to close other dropdowns
          setShowDropdown(!showDropdown)
        }}
      >
        <Icon icon="mdi:account-circle" width="32" className="cursor-pointer" />
      </button>

      <AnimatePresence>
        {showDropdown && (
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
            className="user-dropdown"
          >
            <div className="user-dropdown-header">
              <div className="user-info">
                <div className="user-info-name">{getUserDisplayName()}</div>
                <div className="user-info-email">{user.email}</div>
                <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
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
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
        title={t("auth.logoutConfirmation.title")}
        description={t("auth.logoutConfirmation.message")}
      />
    </div>
  )
}

export default ProfileMenu
