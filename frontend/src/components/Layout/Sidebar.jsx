import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiHome,
  HiThumbUp,
  HiClock,
  HiCollection,
  HiUserGroup,
  HiChartBar,
  HiCog,
  HiChat,
} from 'react-icons/hi';
import './Sidebar.css';

const mainLinks = [
  { to: '/', icon: HiHome, label: 'Home' },
  { to: '/liked-videos', icon: HiThumbUp, label: 'Liked Videos', auth: true },
  { to: '/history', icon: HiClock, label: 'History', auth: true },
  { to: '/subscriptions', icon: HiUserGroup, label: 'Subscriptions', auth: true },
];

const libraryLinks = [
  { to: '/playlists', icon: HiCollection, label: 'Playlists', auth: true },
  { to: '/tweets', icon: HiChat, label: 'Community', auth: true },
];

const creatorLinks = [
  { to: '/dashboard', icon: HiChartBar, label: 'Dashboard', auth: true },
  { to: '/settings', icon: HiCog, label: 'Settings', auth: true },
];

export default function Sidebar({ isOpen }) {
  const { user } = useAuth();

  const renderLinks = (links) =>
    links
      .filter((link) => !link.auth || user)
      .map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          id={`sidebar-${label.toLowerCase().replace(/\s/g, '-')}`}
        >
          <Icon size={20} className="sidebar-link-icon" />
          <span className="sidebar-link-label">{label}</span>
        </NavLink>
      ));

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`} id="main-sidebar">
      <div className="sidebar-content">
        <div className="sidebar-section">
          {renderLinks(mainLinks)}
        </div>

        {user && (
          <>
            <div className="sidebar-divider" />
            <div className="sidebar-section">
              <p className="sidebar-section-title">Library</p>
              {renderLinks(libraryLinks)}
            </div>

            <div className="sidebar-divider" />
            <div className="sidebar-section">
              <p className="sidebar-section-title">Creator</p>
              {renderLinks(creatorLinks)}
            </div>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <p className="sidebar-footer-text">© 2026 Tea</p>
      </div>
    </aside>
  );
}
