// hooks/use-cart.js
import { useState, useEffect, useCallback } from "react";

export function useCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to fetch cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateCart = useCallback(async (action, product) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, product }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const { cart: updatedCart, message } = await response.json();
      setCart(updatedCart);

      return updatedCart;
    } catch (error) {
      console.error(`Error ${action} cart:`, error);
      setError(`Failed to ${action} cart. Please try again.`);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(
    (product) => updateCart("add", product),
    [updateCart]
  );
  const removeFromCart = useCallback(
    (productId) => updateCart("remove", { id: productId }),
    [updateCart]
  );
  const updateQuantity = useCallback(
    (productId, quantity) => updateCart("update", { id: productId, quantity }),
    [updateCart]
  );
  const clearCart = useCallback(() => updateCart("clear"), [updateCart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
    totalItems,
    totalPrice,
  };
}
