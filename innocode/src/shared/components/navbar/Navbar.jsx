import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import InnoCodeLogo from "@/assets/InnoCode_Logo.jpg";
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

        {/* Auth Button */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <button className="signin-btn" onClick={handleLogout}>
              Logout
            </button>
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
