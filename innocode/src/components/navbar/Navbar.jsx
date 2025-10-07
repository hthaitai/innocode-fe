import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import InnoCodeLogo from '../../assets/InnoCode_Logo.jpg';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
          <Link to="/contests" className="navbar-link">
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
          {isLoggedIn ? (
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
