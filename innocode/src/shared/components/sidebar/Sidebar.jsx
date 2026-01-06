import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Icon } from "@iconify/react"

import { useTranslation } from "react-i18next"
import { useAuth } from "@/context/AuthContext"

const allMenus = {
  profile: {
    path: "/profile",
    labelKey: "sidebar.profile",
    icon: "lucide:user",
  },
  dashboard: {
    path: "/dashboard",
    labelKey: "sidebar.dashboard",
    icon: "lucide:layout-dashboard",
  },

  // Student menus
  contests: {
    path: "/contests",
    labelKey: "sidebar.contests",
    icon: "lucide:trophy",
  },
  practice: {
    path: "/practice",
    labelKey: "sidebar.practice",
    icon: "lucide:file-spreadsheet",
  },
  team: { path: "/team", labelKey: "sidebar.team", icon: "lucide:users" },
  certificate: {
    path: "/certificate",
    labelKey: "sidebar.certificate",
    icon: "lucide:award",
  },
  mycontest: {
    path: "/mycontest",
    labelKey: "sidebar.myContest",
    icon: "lucide:notebook-pen",
  },
  // Organizer menus
  organizerContests: {
    path: "/organizer/contests",
    labelKey: "sidebar.contests",
    icon: "lucide:trophy",
  },
  organizerNotifications: {
    path: "/organizer/notifications",
    labelKey: "sidebar.notifications",
    icon: "lucide:bell",
  },

  //judge
  judgeContests: {
    path: "/judge/contests",
    labelKey: "sidebar.contests",
    icon: "lucide:trophy",
  },
  //Mentor menus
  appeal: {
    path: "/appeal",
    labelKey: "sidebar.appeal",
    icon: "lucide:calendar-range",
  },
  // Common menus
  notifications: {
    path: "/notifications",
    labelKey: "sidebar.notifications",
    icon: "lucide:bell",
  },
  provinceStaff: {
    path: "/province-staff",
    labelKey: "sidebar.provinces",
    icon: "lucide:map-pin",
  },
  schoolStaff: {
    path: "/school-staff",
    labelKey: "sidebar.schoolsRequestManagement",
    icon: "lucide:school",
  },
  roleRegistrationsStaff: {
    path: "/role-registrations-staff",
    labelKey: "sidebar.roleRegistrations",
    icon: "lucide:user-check",
  },
  schools: {
    path: "/schools",
    labelKey: "sidebar.schools",
    icon: "lucide:school",
  },
  //SchoolManager menus
  schoolManagerRequests: {
    path: "/school-requests",
    labelKey: "sidebar.schoolCreationRequests",
    icon: "lucide:notepad-text",
  },
  schoolManager: {
    path: "/school-manager",
    labelKey: "sidebar.schoolsManagement",
    icon: "lucide:school",
  },
  userManagement: {
    path: "/user-management",
    labelKey: "sidebar.userManagement",
    icon: "lucide:users",
  },
}

const menuByRole = {
  student: [
    "profile",
    "contests",
    "mycontest",
    "team",
    "certificate",
    "notifications",
  ],
  organizer: ["profile", "organizerContests", "notifications"],
  mentor: [
    "profile",
    "contests",
    "team",
    "certificate",
    "notifications",
    "appeal",
  ],
  staff: [
    "profile",
    "provinceStaff",
    "schoolStaff",
    "schools",
    "roleRegistrationsStaff",
    "contests",
    "notifications",
  ],
  judge: ["profile", "judgeContests", "notifications", "help"],
  admin: ["profile", "dashboard", "userManagement", "notifications", "help"],
  schoolmanager: [
    "profile",
    "schoolManager",
    "schoolManagerRequests",
    "contests",
    "notifications",
  ],
}

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()
  const { t } = useTranslation("common")

  const role = user?.role || "student" // Get role from AuthContext instead of localStorage

  const menuKeys = menuByRole[role] || menuByRole.student
  const menuItems = menuKeys
    .map((key) => {
      const menu = allMenus[key]
      // Override team path for mentor
      if (key === "team" && role === "mentor") {
        return { ...menu, path: "/team" } // Keep same path, but Team.jsx will handle it
      }
      return menu
    })
    .filter(Boolean)

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="space-y-5">
      {/* User Profile Section */}
      <div className="flex items-center gap-3">
        <div className="w-[60px] h-[60px] rounded-full">
          <div className="w-full h-full bg-[linear-gradient(135deg,#ff6b35_0%,#f7931e_100%)] rounded-full"></div>
        </div>

        <div>
          <div className="text-sm leading-5 font-medium">{user?.name}</div>
          <div className="text-xs leading-4">
            {t(`roles.${role}`, role.charAt(0).toUpperCase() + role.slice(1))}{" "}
            {t("sidebar.account")}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-1 w-full">
        {menuItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-2.5 py-2 rounded-[5px] cursor-pointer transition-colors duration-200 relative text-sm no-underline ${
                active ? "bg-[#EAEAEA]" : "hover:bg-[#EAEAEA]"
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center mr-3.5 shrink-0">
                <Icon icon={item.icon} className="w-5 h-5 fill-current" />
              </div>
              <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                {t(item.labelKey)}
              </span>
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#ff6b35] rounded-[5px]" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
