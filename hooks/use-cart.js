import { useState, useEffect, useCallback } from "react";

export function useCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateCart = useCallback(async (action, product) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, product }),
      });
      const updatedCart = await response.json();
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error("Error updating cart:", error);
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
  const clearCart = useCallback(() => updateCart("clear", {}), [updateCart]);

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCart,
    fetchCart,
  };
}
