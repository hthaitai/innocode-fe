import React, { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"

import { useTranslation } from "react-i18next"
import "./Navbar.css"
import InnoCodeLogo from "@/assets/InnoCode_Logo.jpg"
import { useAuth } from "@/context/AuthContext"
import LanguageSwitcher from "@/shared/components/LanguageSwitcher"
import NotificationMenu from "@/shared/components/navbar/NotificationMenu"
import ProfileMenu from "@/shared/components/navbar/ProfileMenu"

const Navbar = () => {
  const navigate = useNavigate()
  const { t } = useTranslation("common")
  const { user, isAuthenticated } = useAuth()
  const rolesToHideNav = [""] // hide nav links for students

  const handleSignIn = () => {
    navigate("/login")
  }

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
    return user.fullName || user.name || user.email?.split("@")[0] || "User"
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
        <div className="flex gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 text-sm leading-5 font-medium text-[#52525B] hover:text-orange-600 no-underline ${
                  isActive ? "text-orange-600 font-semibold" : ""
                }`
              }
            >
              {({ isActive }) => (
                <span className="relative pb-1">
                  {link.name}
                  {isActive && (
                    <div className="absolute bottom-[-3px] left-0 w-full h-[2px] bg-orange-600 rounded-t-sm" />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        {/* Auth Button / User Menu */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <NotificationMenu />
              <ProfileMenu />
            </div>
          ) : (
            <button className="button-orange" onClick={handleSignIn}>
              {t("navbar.signIn")}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
