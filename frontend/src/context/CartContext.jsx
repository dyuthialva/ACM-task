import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Load initial cart from localStorage if present
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('nicemart_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nicemart_cart', JSON.stringify(cart));
  }, [cart]);

  // Add product to cart
  const addToCart = (product, qty = 1) => {
    let result = { success: false, error: null, currentQty: 0 };
    
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        const newQty = existingItem.quantity + qty;
        if (newQty > product.stock) {
          result = { 
            success: false, 
            error: 'exceeds_stock', 
            maxStock: product.stock, 
            currentQty: existingItem.quantity 
          };
          return prevCart; // Return unchanged cart
        }
        
        result = { success: true, currentQty: newQty };
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (qty > product.stock) {
          result = { 
            success: false, 
            error: 'exceeds_stock', 
            maxStock: product.stock, 
            currentQty: 0 
          };
          return prevCart;
        }
        
        result = { success: true, currentQty: qty };
        return [...prevCart, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: qty
        }];
      }
    });

    return result;
  };

  // Remove product from cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id, qty) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          // Bound quantity between 1 and available stock
          const boundedQty = Math.max(1, Math.min(item.stock, qty));
          return { ...item, quantity: boundedQty };
        }
        return item;
      })
    );
  };

  // Clear all items in cart
  const clearCart = () => {
    setCart([]);
  };

  // Derived calculations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
