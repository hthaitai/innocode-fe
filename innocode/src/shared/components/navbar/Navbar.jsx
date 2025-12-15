import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import InnoCodeLogo from "@/assets/InnoCode_Logo.jpg";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@iconify/react";
import NotificationDropdown from "@/features/notification/components/user/NotificationDropdown";
import { useGetNotificationsQuery } from "@/services/notificationApi";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Fetch notifications count for badge
  const { data: notificationsData } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 30000,
  });

  const unreadCount = notificationsData?.data?.items?.length || 0;

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    setShowDropdown(false);
    setShowNotifications(false);
    logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xác định link Contests dựa theo role
  const getContestsLink = () => {
    if (!isAuthenticated || !user) return "/contests";

    switch (user.role) {
      case "organizer":
        return "/organizer/contests";
      case "student":
      case "judge":
      case "admin":
      default:
        return "/contests";
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "";
    return user.name || user.email?.split("@")[0] || "User";
  };

  // Get role badge color
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "role-badge-admin";
      case "organizer":
        return "role-badge-organizer";
      case "student":
        return "role-badge-student";
      case "judge":
        return "role-badge-judge";
      default:
        return "role-badge-default";
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo ">
          <Link to="/" className="logo-link">
            <img src={InnoCodeLogo} alt="InnoCode" className="logo-image" />
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="ml-10 navbar-menu">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to={getContestsLink()} className="navbar-link">
            Contests
          </Link>
          <Link to="/leaderboard" className="navbar-link">
            Leaderboard
          </Link>
          <Link to="/about" className="navbar-link">
            About
          </Link>
        </div>

        {/* Auth Button / User Menu */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-menu-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="user-avatar">
                  <Icon icon="mdi:account-circle" width="24" />
                </div>
                <span className="user-name">{getUserDisplayName()}</span>
                <Icon
                  icon={showDropdown ? "mdi:chevron-up" : "mdi:chevron-down"}
                  width="20"
                />
              </button>

              {/* Notification Bell */}
              <div className="notification-container" ref={notifRef}>
                <button
                  className="notification-bell"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-label="Notifications"
                >
                  <Icon icon="mdi:bell-outline" width="24" />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="notification-dropdown-wrapper">
                    <NotificationDropdown />
                  </div>
                )}
              </div>

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
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="user-dropdown-divider"></div>

                  <div className="user-dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                    >
                      <Icon icon="mdi:account" width="18" />
                      <span>Profile</span>
                    </button>
                  </div>

                  <div className="user-dropdown-divider"></div>

                  <div className="user-dropdown-menu">
                    <button
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <Icon icon="mdi:logout" width="18" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="signin-btn" onClick={handleSignIn}>
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
