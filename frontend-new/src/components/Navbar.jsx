import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { APP_NAME, MODULES, PERMISSIONS } from '../constants';

const Navbar = () => {
  const { user, logout, hasPermission } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          <i className="bi bi-book me-2"></i>
          {APP_NAME}
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                <i className="bi bi-speedometer2 me-1"></i>
                {MODULES.DASHBOARD}
              </Link>
            </li>

            {hasPermission(PERMISSIONS.USER_READ) && (
              <li className="nav-item">
                <Link className="nav-link" to="/users">
                  <i className="bi bi-people me-1"></i>
                  {MODULES.USERS}
                </Link>
              </li>
            )}

            {hasPermission(PERMISSIONS.ROLE_READ) && (
              <li className="nav-item">
                <Link className="nav-link" to="/roles">
                  <i className="bi bi-shield-check me-1"></i>
                  {MODULES.ROLES}
                </Link>
              </li>
            )}

            {hasPermission(PERMISSIONS.BOOK_READ) && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#!"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-book me-1"></i>
                  Library
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/books">
                      {MODULES.BOOKS}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/authors">
                      {MODULES.AUTHORS}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/categories">
                      {MODULES.CATEGORIES}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/publishers">
                      {MODULES.PUBLISHERS}
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {hasPermission(PERMISSIONS.ISSUE_CREATE) && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#!"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-arrow-left-right me-1"></i>
                  Operations
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/issues">
                      {MODULES.ISSUES}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/fines">
                      {MODULES.FINES}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/requests">
                      {MODULES.REQUESTS}
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {hasPermission(PERMISSIONS.ALL) && (
              <li className="nav-item">
                <Link className="nav-link" to="/activity-logs">
                  <i className="bi bi-clock-history me-1"></i>
                  {MODULES.ACTIVITY_LOGS}
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                className="btn btn-link nav-link"
                onClick={toggleTheme}
                title="Toggle Theme"
              >
                <i className={`bi bi-${isDark ? 'sun' : 'moon'}-fill`}></i>
              </button>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#!"
                role="button"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle me-1"></i>
                {user?.name}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
