import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          NovaMart
        </Link>

        <div className="navbar-search">
          <span className="navbar-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            onChange={(e) => onSearch?.(e.target.value)}
            id="search-input"
          />
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/orders" className="user-greeting" id="orders-link">
                📦 Orders
              </Link>
              <span
                className="user-greeting"
                style={{ cursor: 'default', pointerEvents: 'none' }}
              >
                👋 {user.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} id="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" id="login-link">
                Login
              </Link>
              <Link to="/register" id="register-link">
                Sign Up
              </Link>
            </>
          )}
          <button
            className="cart-btn"
            onClick={() => setIsCartOpen(true)}
            id="cart-btn"
          >
            🛒 Cart
            {itemCount > 0 && (
              <span className="cart-count">{itemCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
