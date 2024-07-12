"use client";
import React, { createContext, useContext, useMemo } from "react";
import { useCart as useCartHook } from "@/hooks/use-cart";

const CartContext = createContext();

export function CartProvider({ children }) {
  const cartHook = useCartHook();

  const value = useMemo(() => cartHook, [cartHook]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
