import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/api/orders/my-orders');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="container orders-page" id="orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here.</p>
          <Link
            to="/"
            className="btn btn-primary"
            style={{ marginTop: '16px' }}
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link
              to={`/orders/${order._id}`}
              key={order._id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="order-card" id={`order-${order._id}`}>
                <div className="order-card-header">
                  <div>
                    <span className="order-id">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="order-date" style={{ marginLeft: '16px' }}>
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-items-preview">
                  {order.orderItems.slice(0, 5).map((item, idx) => (
                    <div className="order-item-thumb" key={idx}>
                      <img src={item.image} alt={item.name} />
                    </div>
                  ))}
                  {order.orderItems.length > 5 && (
                    <div
                      className="order-item-thumb"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--bg-glass)',
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      +{order.orderItems.length - 5}
                    </div>
                  )}
                </div>

                <div className="order-card-footer">
                  <span className="order-total">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--accent-primary-light)',
                    }}
                  >
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
