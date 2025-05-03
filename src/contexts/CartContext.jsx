import React, { createContext, useState, useEffect } from "react";

/**
 * Pure helper — deterministic & test‑friendly.
 * Accepts an array of cart‑item objects: { price, amount }.
 * Coerces price to number (FakeStore API sometimes returns strings).
 */
export const calcTotal = (items = []) =>
  items.reduce((sum, item) => {
	const priceNum = typeof item.price === "string" ? parseFloat(item.price) : item.price || 0;
	const amountNum = item.amount ?? 1;
	return sum + priceNum * amountNum;
  }, 0);

export const CartContext = createContext();

/**
 * Context provider for shopping cart.
 */
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [itemAmount, setItemAmount] = useState(0);
  const [total, setTotal] = useState(0);

  /* ── totals ────────────────────────────────────────────── */
  useEffect(() => {
	setItemAmount(cart.reduce((sum, i) => sum + i.amount, 0));
	setTotal(calcTotal(cart));
  }, [cart]);

  /* ── add / bump ────────────────────────────────────────── */
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

  /* ── helpers ───────────────────────────────────────────── */
  const increaseAmount = (id) => {
	const item = cart.find((p) => p.id === id);
	if (item) addToCart(item);
  };

  const decreaseAmount = (id) => {
	setCart((prev) =>
	  prev.flatMap((item) => {
		if (item.id !== id) return item;
		if (item.amount === 1) return [];
		return { ...item, amount: item.amount - 1 };
	  })
	);
  };

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