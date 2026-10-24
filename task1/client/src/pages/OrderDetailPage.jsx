import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const getStatusBadge = (status) => {
    const map = {
      Processing: 'badge-warning',
      Shipped: 'badge-info',
      Delivered: 'badge-success',
      Cancelled: 'badge-danger',
    };
    return map[status] || 'badge-info';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container empty-state" style={{ minHeight: '60vh' }}>
        <div className="empty-state-icon">😕</div>
        <h3>Order not found</h3>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container orders-page" id="order-detail-page">
      <Link to="/orders" className="back-link">
        ← Back to Orders
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0 }}>
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <span className={`badge ${getStatusBadge(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="checkout-grid">
        {/* Order Items */}
        <div className="checkout-form-section">
          <h2>🛍 Items ({order.orderItems.length})</h2>

          {order.orderItems.map((item, idx) => (
            <div className="checkout-item" key={idx}>
              <div className="checkout-item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="checkout-item-info">
                <p className="checkout-item-name">{item.name}</p>
                <p className="checkout-item-detail">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <span className="checkout-item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          {/* Shipping Info */}
          <h2 style={{ marginTop: 'var(--space-xl)' }}>📍 Shipping Address</h2>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-total-row">
            <span>Order Date</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>

          <div className="checkout-total-row">
            <span>Payment</span>
            <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-danger'}`}>
              {order.isPaid ? 'Paid' : 'Unpaid'}
            </span>
          </div>

          <div className="checkout-total-row">
            <span>Delivery</span>
            <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-warning'}`}>
              {order.isDelivered ? 'Delivered' : 'Pending'}
            </span>
          </div>

          <div className="checkout-divider" />

          <div className="checkout-total-row total">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
