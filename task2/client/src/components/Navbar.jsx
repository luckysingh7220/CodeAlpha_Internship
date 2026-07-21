import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Navbar = ({ onCreatePost }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const { data } = await userAPI.searchUsers(query.trim());
        setSearchResults(data);
        setShowResults(true);
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 300);
  };

  const handleResultClick = (userId) => {
    setShowResults(false);
    setMobileSearchOpen(false);
    setSearchQuery('');
    navigate(`/profile/${userId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="navbar-logo-icon">🌐</div>
        NexusHub
      </Link>

      {isAuthenticated && (
        <>
          {/* Desktop search bar */}
          <div className="navbar-search navbar-search-desktop" ref={searchRef}>
            <span className="navbar-search-icon">🔍</span>
            <input
              type="text"
              className="navbar-search-input"
              placeholder="Search people..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
            />
            {showResults && searchResults.length > 0 && (
              <div className="navbar-search-results">
                {searchResults.map((u) => (
                  <div
                    key={u._id}
                    className="navbar-search-result-item"
                    onClick={() => handleResultClick(u._id)}
                  >
                    <img src={u.avatar} alt={u.username} className="avatar avatar-sm" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.username}</div>
                      {u.bio && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {u.bio.slice(0, 50)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile search overlay */}
          {mobileSearchOpen && (
            <div className="navbar-search navbar-search-mobile" ref={searchRef}>
              <span className="navbar-search-icon">🔍</span>
              <input
                type="text"
                className="navbar-search-input"
                placeholder="Search people..."
                value={searchQuery}
                onChange={handleSearch}
                autoFocus
              />
              {showResults && searchResults.length > 0 && (
                <div className="navbar-search-results">
                  {searchResults.map((u) => (
                    <div
                      key={u._id}
                      className="navbar-search-result-item"
                      onClick={() => handleResultClick(u._id)}
                    >
                      <img src={u.avatar} alt={u.username} className="avatar avatar-sm" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.username}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            {/* Mobile search toggle */}
            <button
              className="btn btn-ghost navbar-search-toggle"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              title="Search"
            >
              🔍
            </button>

            <button className="btn btn-primary btn-sm navbar-post-btn" onClick={onCreatePost}>
              ✍️ <span className="navbar-post-btn-text">Post</span>
            </button>

            <Link to={`/profile/${user?._id}`} className="navbar-user">
              <img src={user?.avatar} alt={user?.username} className="avatar avatar-xs" />
              <span className="navbar-user-name">{user?.username}</span>
            </Link>

            <button className="btn btn-ghost navbar-logout-btn" onClick={handleLogout} title="Logout">
              🚪
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
