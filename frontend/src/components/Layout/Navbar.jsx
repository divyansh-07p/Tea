import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiSearch, HiMenu, HiUpload } from 'react-icons/hi';
import { RiVideoAddFill } from 'react-icons/ri';
import logo from '../../assets/logo.png';
import './Navbar.css';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-left">
        <button className="btn-icon navbar-menu-btn" onClick={onToggleSidebar} id="sidebar-toggle">
          <HiMenu size={22} />
        </button>
        <Link to="/" className="navbar-logo" id="logo-link">
          <img src={logo} alt="Tea" className="navbar-logo-img" />
        </Link>
      </div>

      <form className="navbar-search" onSubmit={handleSearch} id="search-form">
        <input
          type="text"
          className="navbar-search-input"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="search-input"
        />
        <button type="submit" className="navbar-search-btn" id="search-button">
          <HiSearch size={18} />
        </button>
      </form>

      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/upload" className="btn btn-primary btn-sm navbar-upload-btn" id="upload-btn">
              <RiVideoAddFill size={18} />
              <span className="upload-text">Upload</span>
            </Link>

            <div className="navbar-user-menu" ref={menuRef}>
              <button
                className="navbar-avatar-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                id="user-menu-trigger"
              >
                <img src={user.avatar} alt={user.fullName} className="avatar" />
              </button>

              {showUserMenu && (
                <div className="user-dropdown" id="user-dropdown">
                  <div className="user-dropdown-header">
                    <img src={user.avatar} alt={user.fullName} className="avatar avatar-lg" />
                    <div>
                      <p className="dropdown-name">{user.fullName}</p>
                      <p className="dropdown-username">@{user.username}</p>
                    </div>
                  </div>
                  <div className="divider" />
                  <Link to={`/channel/${user.username}`} className="dropdown-item" onClick={() => setShowUserMenu(false)} id="my-channel-link">
                    Your Channel
                  </Link>
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setShowUserMenu(false)} id="dashboard-link">
                    Dashboard
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setShowUserMenu(false)} id="settings-link">
                    Settings
                  </Link>
                  <div className="divider" />
                  <button className="dropdown-item dropdown-item-danger" onClick={handleLogout} id="logout-btn">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm" id="login-btn">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
