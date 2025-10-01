import React from 'react';
import { Icon } from '@iconify/react';
import './sidebar.css';

const Sidebar = () => {
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
        <div className="nav-item">
          <Icon
            icon="lucide:layout-dashboard"
            width="20"
            height="20"
            className="nav-icon"
          />
          <span className="nav-label">Dashboard</span>
        </div>

        <div className="nav-item active">
          <Icon
            icon="lucide:trophy"
            width="20"
            height="20"
            className="nav-icon"
          />
          <span className="nav-label">Contests</span>
          <div className="active-indicator"></div>
        </div>

        <div className="nav-item">
          <Icon
            icon="lucide:file-spreadsheet"
            width="20"
            height="20"
            className="nav-icon"
          />
          <span className="nav-label">Practice</span>
        </div>

        <div className="nav-item">
          <Icon
            icon="lucide:users"
            width="20"
            height="20"
            className="nav-icon"
          />
          <span className="nav-label">Team</span>
        </div>

        <div className="nav-item">
          <Icon
            icon="lucide:chart-no-axes-column"
            width="20"
            height="20"
            className="nav-icon"
          />
          <span className="nav-label">Leaderboard</span>
        </div>

        <div className="nav-item">
          <Icon
            icon="lucide:bell"
            width="20"
            height="20"
            className="nav-icon"
          />
          <span className="nav-label">Announcements</span>
        </div>

        <div className="nav-item">
          <Icon
            icon="lucide:circle-question-mark"
            width="20"
            height="20"
            className="nav-icon"
          />
          <span className="nav-label">Help</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
