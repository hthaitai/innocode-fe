import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/profile', label: 'Profile', icon: 'lucide:user' },
    { path: '/dashboard', label: 'Dashboard', icon: 'lucide:layout-dashboard' },
    { path: '/contests', label: 'Contests', icon: 'lucide:trophy' },
    { path: '/practice', label: 'Practice', icon: 'lucide:file-spreadsheet' },
    { path: '/team', label: 'Team', icon: 'lucide:users' },
    { path: '/leaderboard', label: 'Leaderboard', icon: 'lucide:chart-no-axes-column' },
    { path: '/announcements', label: 'Announcements', icon: 'lucide:bell' },
    { path: '/help', label: 'Help', icon: 'lucide:circle-question-mark' },
  ];
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
          <div className="user-role">Student account</div>
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
              width="20"
              height="20"
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
