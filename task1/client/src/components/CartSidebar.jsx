import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartSidebar = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    itemCount,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
        onClick={() => setIsCartOpen(false)}
        id="cart-overlay"
      />
      <aside
        className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}
        id="cart-sidebar"
      >
        <div className="cart-header">
          <h2>
            Shopping Cart{' '}
            {itemCount > 0 && (
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                ({itemCount})
              </span>
            )}
          </h2>
          <button
            className="cart-close"
            onClick={() => setIsCartOpen(false)}
            id="cart-close-btn"
          >
            ✕
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>Your cart is empty</p>
              <p style={{ fontSize: 'var(--font-size-xs)', marginTop: '8px' }}>
                Add some products to get started!
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item._id} id={`cart-item-${item._id}`}>
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  <div className="cart-item-controls">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="cart-item-qty">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.countInStock}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item._id)}
                  title="Remove item"
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span className="cart-total-label">Subtotal</span>
              <span className="cart-total-price">${subtotal.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={handleCheckout}
              id="checkout-btn"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
