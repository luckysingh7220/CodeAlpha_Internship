import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books'];

const HomePage = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (searchQuery) params.search = searchQuery;

      const { data } = await api.get('/api/products', { params });
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="container">
          <h1 className="animate-fade-in-up">
            Discover <span className="gradient-text">Premium</span>
            <br />
            Products for You
          </h1>
          <p className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Curated collections of the finest electronics, fashion, and home
            goods — delivered with care.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="container">
        <div className="category-filters" id="category-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              id={`category-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="container products-section" id="products-section">
        <div className="section-header">
          <h2 className="section-title">
            {activeCategory === 'All' ? 'All Products' : activeCategory}
          </h2>
          <span className="product-count">
            {products.length} product{products.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="product-grid stagger-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
