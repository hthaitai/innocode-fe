import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./Sidebar.css";
import { useAuth } from "@/context/AuthContext";

const allMenus = {
  profile: { path: "/profile", label: "Profile", icon: "lucide:user" },
  dashboard: {
    path: "/dashboard",
    label: "Dashboard",
    icon: "lucide:layout-dashboard",
  },

  // Student menus
  contests: { path: "/contests", label: "Contests", icon: "lucide:trophy" },
  practice: {
    path: "/practice",
    label: "Practice",
    icon: "lucide:file-spreadsheet",
  },
  team: { path: "/team", label: "Team", icon: "lucide:users" },
  leaderboard: {
    path: "/leaderboard",
    label: "Leaderboard",
    icon: "lucide:chart-no-axes-column",
  },
  certificate: {
    path: "/certificate",
    label: "Certificate",
    icon: "lucide:award",
  },
  mycontest: {
    path: "/mycontest",
    label: "My Contest",
    icon: "lucide:notebook-pen",
  },
  // Organizer menus
  organizerContests: {
    path: "/organizer/contests",
    label: "Contests",
    icon: "lucide:trophy",
  },
  organizerProvinces: {
    path: "/organizer/provinces",
    label: "Provinces",
    icon: "lucide:map-pin",
  },
  organizerSchools: {
    path: "/organizer/schools",
    label: "Schools",
    icon: "lucide:school",
  },
  organizerNotifications: {
    path: "/organizer/notifications",
    label: "Notifications",
    icon: "lucide:bell",
  },

  //judge
  manualSubmissions: {
    path: "/judge/manual-submissions",
    label: "Submissions",
    icon: "lucide:file-text",
  },
  //Mentor menus
  appeal: {
    path: "/appeal",
    label: "Appeal",
    icon: "lucide:calendar-range",
  },
  // Common menus
  notifications: {
    path: "/notifications",
    label: "Notifications",
    icon: "lucide:bell",
  },
  provinceStaff: {
    path: "/province-staff",
    label: "Provinces",
    icon: "lucide:map-pin",
  },
  schoolStaff: {
    path: "/school-staff",
    label: "Schools",
    icon: "lucide:school",
  },
  roleRegistrationsStaff: {
    path: "/role-registrations-staff",
    label: "Role Registrations",
    icon: "lucide:user-check",
  },
  //SchoolManager menus
  schoolManager: {
    path: "/school-manager",
    label: "School Management",
    icon: "lucide:school",
  },
};

const menuByRole = {
  student: [
    "profile",
    "contests",
    "mycontest",
    "practice",
    "team",
    "leaderboard",
    "certificate",
    "notifications",
  ],
  organizer: [
    "profile",
    "organizerContests",
    "organizerProvinces",
    "organizerSchools",
    "notifications",
  ],
  mentor: [
    "profile",
    "leaderboard",
    "contests",
    "team",
    "notifications",
    "appeal",
  ],
  staff: [
    "profile",
    "provinceStaff",
    "schoolStaff",
    "roleRegistrationsStaff",
    "leaderboard",
    "contests",
    "team",
    "notifications",
  ],
  judge: ["profile", "dashboard", "manualSubmissions", "notifications", "help"],
  admin: ["profile", "dashboard", "leaderboard", "notifications", "help"],
  schoolmanager: [
    "profile",
    "schoolManager",
    "leaderboard",
    "contests",
    "team",
    "notifications",
  ],
};

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role || "student"; // Get role from AuthContext instead of localStorage
  const menuKeys = menuByRole[role] || menuByRole.student;
  const menuItems = menuKeys
    .map((key) => {
      const menu = allMenus[key];
      // Override team path for mentor
      if (key === "team" && role === "mentor") {
        return { ...menu, path: "/team" }; // Keep same path, but Team.jsx will handle it
      }
      return menu;
    })
    .filter(Boolean);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sidebar">
      {/* User Profile Section */}
      <div className="flex items-center gap-5 mb-5">
        <div className="w-[60px] h-[60px]">
          <div className="avatar-gradient"></div>
        </div>
        
        <div>
          <div className="text-sm leading-5 font-bold">{user?.name || "User"}</div>
          <div className="text-xs leading-4">
            {role.charAt(0).toUpperCase() + role.slice(1)} account
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
          >
            <Icon icon={item.icon} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
            {isActive(item.path) && <div className="active-indicator"></div>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
