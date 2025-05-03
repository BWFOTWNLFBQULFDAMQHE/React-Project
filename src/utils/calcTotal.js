/**
 * Calculates the aggregated cart value.
 * Accepts an array of items { price, amount }.
 */
export function calcTotal(items = []) {
    return items.reduce((sum, item) => {
      const price = typeof item.price === "string" ? parseFloat(item.price) : item.price || 0;
      const qty = item.amount ?? 1;
      return sum + price * qty;
    }, 0);
  }