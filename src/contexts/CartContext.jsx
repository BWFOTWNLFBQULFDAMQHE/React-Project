import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [itemAmount, setItemAmount] = useState(0);
  const [total, setTotal] = useState(0);

  // Re-calculate totals whenever the cart updates
  useEffect(() => {
	const amount = cart.reduce((acc, item) => acc + item.amount, 0);
	setItemAmount(amount);

	const priceTotal = cart.reduce(
	  (acc, item) => acc + item.price * item.amount,
	  0
	);
	setTotal(priceTotal);
  }, [cart]);

  // Add an item or increase its quantity
  const addToCart = (product, id) => {
	const existing = cart.find((item) => item.id === id);
	if (existing) {
	  setCart(
		cart.map((item) =>
		  item.id === id ? { ...item, amount: item.amount + 1 } : item
		)
	  );
	} else {
	  setCart([...cart, { ...product, amount: 1 }]);
	}
  };

  // Remove an item completely
  const removeFromCart = (id) => {
	setCart(cart.filter((item) => item.id !== id));
  };

  // Empty the cart
  const clearCart = () => setCart([]);

  const increaseAmount = (id) => {
	const item = cart.find((i) => i.id === id);
	if (item) addToCart(item, id);
  };

  const decreaseAmount = (id) => {
	const item = cart.find((i) => i.id === id);
	if (!item) return;
	if (item.amount === 1) {
	  removeFromCart(id);
	} else {
	  setCart(
		cart.map((i) =>
		  i.id === id ? { ...i, amount: i.amount - 1 } : i
		)
	  );
	}
  };

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