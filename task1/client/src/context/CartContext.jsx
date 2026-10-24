import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Restore cart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('novamart_cart');
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch {
        localStorage.removeItem('novamart_cart');
      }
    }
  }, []);

  // Persist cart on change
  useEffect(() => {
    localStorage.setItem('novamart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + quantity,
                  product.countInStock
                ),
              }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.countInStock,
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.min(quantity, item.countInStock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setIsCartOpen(false);
  };

  const totals = useMemo(() => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { itemCount, subtotal };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        ...totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
