import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < full; i++) {
      stars.push(
        <span key={`full-${i}`} className="star">
          ★
        </span>
      );
    }
    if (hasHalf) {
      stars.push(
        <span key="half" className="star" style={{ opacity: 0.5 }}>
          ★
        </span>
      );
    }
    const empty = 5 - full - (hasHalf ? 1 : 0);
    for (let i = 0; i < empty; i++) {
      stars.push(
        <span key={`empty-${i}`} style={{ color: 'var(--text-muted)' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      className="product-card"
      onClick={handleCardClick}
      id={`product-card-${product._id}`}
    >
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-card-category">{product.category}</span>
      </div>
      <div className="product-card-body">
        <p className="product-card-brand">{product.brand}</p>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-footer">
          <span className="product-card-price">
            ${product.price.toFixed(2)}
          </span>
          <div className="product-card-rating">
            {renderStars(product.rating)}
            <span>({product.numReviews})</span>
          </div>
        </div>
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.countInStock === 0}
        >
          {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
