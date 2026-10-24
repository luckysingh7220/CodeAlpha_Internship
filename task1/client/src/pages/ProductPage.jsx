import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) {
      stars.push(
        <span key={`f-${i}`} className="star">
          ★
        </span>
      );
    }
    if (hasHalf) {
      stars.push(
        <span key="h" className="star" style={{ opacity: 0.5 }}>
          ★
        </span>
      );
    }
    const empty = 5 - full - (hasHalf ? 1 : 0);
    for (let i = 0; i < empty; i++) {
      stars.push(
        <span key={`e-${i}`} style={{ color: 'var(--text-muted)' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container empty-state" style={{ minHeight: '60vh' }}>
        <div className="empty-state-icon">😕</div>
        <h3>Product not found</h3>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="container product-detail" id="product-detail">
      <Link to="/" className="back-link">
        ← Back to Products
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <span className="product-detail-category">{product.category}</span>
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-brand">{product.brand}</p>

          <div className="product-detail-rating">
            {renderStars(product.rating)}
            <span>
              {product.rating.toFixed(1)} · {product.numReviews} reviews
            </span>
          </div>

          <p className="product-detail-price">${product.price.toFixed(2)}</p>

          <p className="product-detail-desc">{product.description}</p>

          <div className="stock-status">
            <span
              className={`stock-dot ${product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}
            />
            <span>
              {product.countInStock > 0
                ? `In Stock (${product.countInStock} available)`
                : 'Out of Stock'}
            </span>
          </div>

          {product.countInStock > 0 && (
            <>
              <div className="quantity-selector">
                <label>Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  id="quantity-select"
                >
                  {[...Array(Math.min(product.countInStock, 10)).keys()].map(
                    (i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    )
                  )}
                </select>
              </div>

              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                style={{ width: '100%', maxWidth: '320px' }}
                id="add-to-cart-detail"
              >
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
