import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './sidebar.css';

const allMenus = {
  profile: { path: '/profile', label: 'Profile', icon: 'lucide:user' },
  dashboard: { path: '/dashboard', label: 'Dashboard', icon: 'lucide:layout-dashboard' },
  contests: { path: '/contests', label: 'Contests', icon: 'lucide:trophy' },
  organizerContests: { path: '/organizer/contests', label: 'Contests', icon: 'lucide:trophy' },
  organizerProvinces: { path: '/organizer/provinces', label: 'Provinces', icon: 'lucide:map-pin' },
  practice: { path: '/practice', label: 'Practice', icon: 'lucide:file-spreadsheet' },
  team: { path: '/team', label: 'Team', icon: 'lucide:users' },
  leaderboard: { path: '/leaderboard', label: 'Leaderboard', icon: 'lucide:chart-no-axes-column' },
  announcements: { path: '/announcements', label: 'Announcements', icon: 'lucide:bell' },
  help: { path: '/help', label: 'Help', icon: 'lucide:circle-question-mark' },
  certificate: { path: '/certificate', label: 'Certificate', icon: 'lucide:award' },
};

const menuByRole = {
  student: ['profile', 'contests', 'practice', 'team', 'leaderboard', 'announcements', 'certificate','help' ],
  organizer: ['profile', 'organizerContests', 'organizerProvinces'],
  judge: ['profile', 'dashboard', 'contests', 'announcements'],
  admin: ['profile', 'dashboard', 'leaderboard', 'announcements', 'help'],
};

const Sidebar = () => {
  const location = useLocation();
  const role = localStorage.getItem('role');
  const menuKeys = menuByRole[role] || menuByRole.student; // Fallback to student role
  const menuItems = menuKeys.map(key => allMenus[key]).filter(Boolean);
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
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
          <div className="user-name">Lộc</div>
          <div className="user-role">{(role || 'student').charAt(0).toUpperCase() + (role || 'student').slice(1)} account</div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <Icon
              icon={item.icon}
              className="nav-icon"
            />
            <span className="nav-label">{item.label}</span>
            {isActive(item.path) && <div className="active-indicator"></div>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
