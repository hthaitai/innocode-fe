import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import InnoCodeLogo from "@/assets/InnoCode_Logo.jpg";
import { useAuth } from '@/context/AuthContext';
import { Icon } from '@iconify/react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleSignIn = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    // Close dropdown first
    setShowDropdown(false);
    
    // Clear authentication state from context
    logout();
    
    // Clear any stored tokens or user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Xác định link Contests dựa theo role
  const getContestsLink = () => {
    if (!isAuthenticated || !user) return '/contests';
    
    switch(user.role) {
      case 'organizer':
        return '/organizer/contests';
      case 'student':
      case 'judge':
      case 'admin':
      default:
        return '/contests';
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.name || user.email?.split('@')[0] || 'User';
  };

  // Get role badge color
  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'admin':
        return 'role-badge-admin';
      case 'organizer':
        return 'role-badge-organizer';
      case 'student':
        return 'role-badge-student';
      case 'judge':
        return 'role-badge-judge';
      default:
        return 'role-badge-default';
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

              {showDropdown && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-info">
                      <div className="user-info-name">{getUserDisplayName()}</div>
                      <div className="user-info-email">{user.email}</div>
                      <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="user-dropdown-divider"></div>

                  <div className="user-dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate('/profile');
                        setShowDropdown(false);
                      }}
                    >
                      <Icon icon="mdi:account" width="18" />
                      <span>Profile</span>
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate('/dashboard');
                        setShowDropdown(false);
                      }}
                    >
                      <Icon icon="mdi:view-dashboard" width="18" />
                      <span>Dashboard</span>
                    </button>
                  </div>

                  <div className="user-dropdown-divider"></div>

                  <div className="user-dropdown-menu">
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
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
