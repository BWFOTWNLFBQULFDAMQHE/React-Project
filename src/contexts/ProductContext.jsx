import React, { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
	// products state
	const [products, setProducts] = useState([]);
	// fetch products
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch("https://fakestoreapi.com/products");
				const data = await response.json();
				setProducts(data);
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		};
		fetchProducts();
	}, []);

	return (
		<ProductContext.Provider value={{ products }}>
			{children}
		</ProductContext.Provider>
	);
};

export default ProductProvider;

/**
 * Utility helper to filter an array of product objects by category.
 */
export const filterProducts = (products = [], category = "all") => {
  if (!Array.isArray(products)) {
	throw new TypeError("products must be an array");
  }
  if (!category || category === "all") return products;
  return products.filter((product) => product?.category === category);
};
