"use client";
import { useState, useCallback, useEffect } from "react";

const supportedCurrencies = [
  { code: "XAF", name: "Central African CFA franc", symbol: "FCFA" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "USD", name: "United States Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "GBP", name: "British Pound Sterling", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
];

export function useCurrency() {
  const [currency, setCurrency] = useState("XAF");
  const [exchangeRates, setExchangeRates] = useState({ XAF: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrencyData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching currency data...");
      const response = await fetch("/api/currency");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Currency data received:", data);
      setExchangeRates(data.rates);
      setCurrency(data.currency || "XAF");
    } catch (error) {
      console.error("Error fetching currency data:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
      setError(`Failed to fetch currency data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrencyData();
  }, [fetchCurrencyData]);

  const changeCurrency = useCallback(async (newCurrency) => {
    if (supportedCurrencies.some((c) => c.code === newCurrency)) {
      setLoading(true);
      setError(null);
      try {
        console.log(`Changing currency to ${newCurrency}...`);
        const response = await fetch("/api/currency", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currency: newCurrency }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Currency change response:", data);
        setCurrency(data.currency);
      } catch (error) {
        console.error("Error changing currency:", error);
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
        });
        setError(`Failed to change currency: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Unsupported currency:", newCurrency);
      setError(`Unsupported currency: ${newCurrency}`);
    }
  }, []);

  const getCurrentRatio = useCallback(() => {
    return exchangeRates[currency] || 1;
  }, [currency, exchangeRates]);

  const convertCurrency = useCallback(
    (amount, fromCurrency, toCurrency) => {
      if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        console.error("Invalid currency for conversion", {
          fromCurrency,
          toCurrency,
          availableRates: Object.keys(exchangeRates),
        });
        return null;
      }

      const amountInXAF = amount / exchangeRates[fromCurrency];
      return amountInXAF * exchangeRates[toCurrency];
    },
    [exchangeRates]
  );

  const formatPrice = useCallback(
    (amount, fromCurrency = "XAF") => {
      if (!currency || !exchangeRates[currency]) {
        console.warn(`Exchange rate not available for ${currency}`);
        return `${amount} ${fromCurrency}`;
      }

      let convertedAmount = convertCurrency(amount, fromCurrency, currency);

      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        currencyDisplay: "symbol",
      }).format(convertedAmount);
    },
    [currency, exchangeRates, convertCurrency]
  );

  const getCurrencySymbol = useCallback((currencyCode) => {
    const currencyObj = supportedCurrencies.find(
      (c) => c.code === currencyCode
    );
    if (!currencyObj) {
      console.warn(`Symbol not found for currency: ${currencyCode}`);
    }
    return currencyObj ? currencyObj.symbol : currencyCode;
  }, []);

  const formatPriceWithSymbol = useCallback(
    (amount, fromCurrency = "XAF") => {
      const formattedPrice = formatPrice(amount, fromCurrency);
      const symbol = getCurrencySymbol(currency);
      return `${symbol} ${formattedPrice}`;
    },
    [formatPrice, getCurrencySymbol, currency]
  );

  const getExchangeRate = useCallback(
    (fromCurrency, toCurrency) => {
      if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        console.error("Invalid currency for exchange rate", {
          fromCurrency,
          toCurrency,
          availableRates: Object.keys(exchangeRates),
        });
        return null;
      }
      return exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    },
    [exchangeRates]
  );

  return {
    currency,
    changeCurrency,
    supportedCurrencies,
    loading,
    error,
    formatPrice,
    refreshRates: fetchCurrencyData,
    convertCurrency,
    getCurrencySymbol,
    formatPriceWithSymbol,
    getExchangeRate,
    getCurrentRatio,
  };
}
