// src/contexts/CartContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

/**
 * CartProvider keeps global cart state:
 *   cart    – array of { id, title, price, image, category, amount }
 *   total   – overall cost
 *   itemAmount – total quantity across items
 */
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [itemAmount, setItemAmount] = useState(0);
  const [total, setTotal] = useState(0);

  /* ── totals ────────────────────────────────────────────── */
  useEffect(() => {
    setItemAmount(cart.reduce((sum, i) => sum + i.amount, 0));
    setTotal(cart.reduce((sum, i) => sum + i.price * i.amount, 0));
  }, [cart]);

  /* ── add or bump ───────────────────────────────────────── */
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, amount: p.amount + 1 } : p
        );
      }
      return [...prev, { ...product, amount: 1 }];
    });
  };

  /* ── qty helpers ───────────────────────────────────────── */
  const increaseAmount = (id) => {
    const item = cart.find((p) => p.id === id);
    if (item) addToCart(item);
  };

  const decreaseAmount = (id) => {
    setCart((prev) =>
      prev.flatMap((item) => {
        if (item.id !== id) return item;
        if (item.amount === 1) return [];                 // drop at zero
        return { ...item, amount: item.amount - 1 };
      })
    );
  };

  /* ── misc ─────────────────────────────────────────────── */
  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseAmount,
        decreaseAmount,
        itemAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
