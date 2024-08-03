"use client";
import React, { createContext, useContext } from "react";
import { useCurrency as useCurrencyHook } from "@/hooks/use-currency";
const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const currencyHook = useCurrencyHook();

  return (
    <CurrencyContext.Provider value={currencyHook}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
