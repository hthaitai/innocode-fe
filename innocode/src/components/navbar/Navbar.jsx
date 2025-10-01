import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import InnoCodeLogo from '../../assets/InnoCode_Logo.jpg';

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
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

        {/* Sign In Button */}
        <div className="navbar-auth">
          <button className="signin-btn" onClick={handleSignIn}>
            Sign in
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
