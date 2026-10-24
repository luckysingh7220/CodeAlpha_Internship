import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const CheckoutPage = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shippingCost = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleChange = (e) => {
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: shipping,
        totalPrice: total,
      };

      const { data } = await api.post('/api/orders', orderData);
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to place order. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container empty-state" style={{ minHeight: '60vh' }}>
        <div className="empty-state-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some products before checking out.</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/')}
          style={{ marginTop: '16px' }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container checkout-page" id="checkout-page">
      <h1>Checkout</h1>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="checkout-grid">
          {/* Shipping Form */}
          <div className="checkout-form-section">
            <h2>📦 Shipping Address</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="ship-name">
                Full Name
              </label>
              <input
                className="form-input"
                id="ship-name"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={shipping.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ship-address">
                Street Address
              </label>
              <input
                className="form-input"
                id="ship-address"
                name="address"
                type="text"
                placeholder="123 Main Street"
                value={shipping.address}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="ship-city">
                  City
                </label>
                <input
                  className="form-input"
                  id="ship-city"
                  name="city"
                  type="text"
                  placeholder="New York"
                  value={shipping.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ship-postal">
                  Postal Code
                </label>
                <input
                  className="form-input"
                  id="ship-postal"
                  name="postalCode"
                  type="text"
                  placeholder="10001"
                  value={shipping.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ship-country">
                Country
              </label>
              <input
                className="form-input"
                id="ship-country"
                name="country"
                type="text"
                placeholder="United States"
                value={shipping.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>

            {cartItems.map((item) => (
              <div className="checkout-item" key={item._id}>
                <div className="checkout-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="checkout-item-info">
                  <p className="checkout-item-name">{item.name}</p>
                  <p className="checkout-item-detail">Qty: {item.quantity}</p>
                </div>
                <span className="checkout-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-total-row">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="checkout-total-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="checkout-total-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
              style={{ marginTop: 'var(--space-lg)' }}
              id="place-order-btn"
            >
              {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
            </button>

            {subtotal <= 100 && (
              <p
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  marginTop: 'var(--space-md)',
                }}
              >
                💡 Free shipping on orders over $100
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
