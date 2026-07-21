import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileNav = ({ onCreatePost }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="mobile-nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        title="Feed"
      >
        <span className="mobile-nav-icon">🏠</span>
        <span className="mobile-nav-label">Feed</span>
      </NavLink>

      <NavLink
        to="/explore"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        title="Explore"
      >
        <span className="mobile-nav-icon">🧭</span>
        <span className="mobile-nav-label">Explore</span>
      </NavLink>

      <button
        className="mobile-nav-post-btn"
        onClick={onCreatePost}
        title="Create Post"
      >
        <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>✍️</span>
      </button>

      <NavLink
        to={`/profile/${user?._id}`}
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        title="Profile"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.username} className="mobile-nav-avatar" />
        ) : (
          <span className="mobile-nav-icon">👤</span>
        )}
        <span className="mobile-nav-label">Profile</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
