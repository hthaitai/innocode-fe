import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./sidebar.css";
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

  // Common menus
  announcements: {
    path: "/announcements",
    label: "Announcements",
    icon: "lucide:bell",
  },
  help: { path: "/help", label: "Help", icon: "lucide:circle-question-mark" },
};

const menuByRole = {
  student: [
    "profile",
    "contests",
    "practice",
    "team",
    "leaderboard",
    "certificate",
    "announcements",
    "help",
  ],
  organizer: [
    "profile",
    "organizerContests",
    "organizerProvinces",
    "organizerSchools",
    "announcements",
    "help",
  ],
  judge: ["profile", "dashboard", "contests", "announcements", "help"],
  admin: ["profile", "dashboard", "leaderboard", "announcements", "help"],
};

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.role || "student"; // Get role from AuthContext instead of localStorage

  const menuKeys = menuByRole[role] || menuByRole.student;
  const menuItems = menuKeys.map((key) => allMenus[key]).filter(Boolean);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sidebar">
      {/* User Profile Section */}
      <div className="user-profile">
        <div className="avatar">
          <div className="avatar-gradient"></div>
        </div>
        <div className="user-info">
          <div className="user-name">{user?.name || "User"}</div>
          <div className="user-role">
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
