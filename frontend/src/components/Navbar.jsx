import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏋️</span>
          <span className="logo-text">Rella</span>
        </Link>
        
        {isAuthPage && (
          <div className="navbar-auth-links">
            <Link 
              to="/login" 
              className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className={`nav-link btn-primary ${location.pathname === '/register' ? 'active' : ''}`}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
