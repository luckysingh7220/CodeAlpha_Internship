import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const Sidebar = () => {
  const { user } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        // Fetch some users to suggest
        const { data } = await userAPI.searchUsers('a');
        // Filter out current user and people already followed
        const filtered = data
          .filter((u) => u._id !== user?._id)
          .slice(0, 5);
        setSuggestedUsers(filtered);
      } catch (err) {
        // Silently fail
      }
    };

    if (user) fetchSuggested();
  }, [user]);

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="sidebar-link-icon">🏠</span>
          Feed
        </NavLink>
        <NavLink
          to="/explore"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="sidebar-link-icon">🧭</span>
          Explore
        </NavLink>
        <NavLink
          to={`/profile/${user?._id}`}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="sidebar-link-icon">👤</span>
          Profile
        </NavLink>
      </nav>

      {suggestedUsers.length > 0 && (
        <>
          <div className="sidebar-section-title">Suggested People</div>
          <div className="sidebar-suggested-users">
            {suggestedUsers.map((u) => (
              <NavLink
                key={u._id}
                to={`/profile/${u._id}`}
                className="sidebar-user-item"
              >
                <img src={u.avatar} alt={u.username} className="avatar avatar-sm" />
                <div className="sidebar-user-info">
                  <div className="sidebar-user-name">{u.username}</div>
                  <div className="sidebar-user-bio">{u.bio || 'No bio yet'}</div>
                </div>
              </NavLink>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
