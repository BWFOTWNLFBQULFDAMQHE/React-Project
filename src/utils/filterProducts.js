/**
 * Filters a list of products by category.
 *
 * @param {Array<Object>} products - The complete product list.
 * @param {string} category - Desired category name. Use "all" to return the original list.
 * @returns {Array<Object>} Filtered product list.
 */
export function filterProducts(products = [], category = "all") {
    if (!Array.isArray(products)) {
      throw new TypeError("products must be an array");
    }
    if (!category || category === "all") return products;
    return products.filter((p) => p?.category === category);
  }