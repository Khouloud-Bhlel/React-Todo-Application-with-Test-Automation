import React from 'react';
import { useAuth } from '../Auth/AuthContext';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import './styles/Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <header className="app-header" id="app-header">
      <div className="header-content" id="header-content">
        <div className="header-left">
          <h1 className="app-title">Todo App</h1>
        </div>
        
        <div className="header-right">
          <div className="user-info" id="user-info">
            <FaUser className="user-icon" />
            <span className="user-name" id="user-name">
              Welcome, {user?.name || user?.email}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="logout-button"
            id="logout-button"
            title="Logout"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
