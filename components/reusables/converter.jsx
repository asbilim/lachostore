"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrencyIcon, ArrowRightLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "../ui/scroll-area";

export default function Component() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("XAF");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rates, setRates] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const currencies = [
    { code: "XAF", name: "Central African CFA franc", flag: "🇨🇲" },
    { code: "USD", name: "US Dollar", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", flag: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
    { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬" },
    { code: "XOF", name: "West African CFA franc", flag: "🇸🇳" },
    { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
    { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪" },
    { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬" },
    { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
    { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
    { code: "KWD", name: "Kuwaiti Dinar", flag: "🇰🇼" },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchExchangeRates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (Object.keys(rates).length > 0) {
      handleConvert();
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const fetchExchangeRates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_CURRENCY_SECRET}/latest/XAF`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
      }
      const data = await response.json();
      if (data.result === "success") {
        setRates({ XAF: 1, ...data.conversion_rates });
      } else {
        throw new Error(data["error-type"] || "Unknown error occurred");
      }
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch exchange rates. Please try again later.");
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to fetch exchange rates. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleConvert = () => {
    if (rates[fromCurrency] && rates[toCurrency]) {
      const convertedAmount = (
        (amount * rates[toCurrency]) /
        rates[fromCurrency]
      ).toFixed(2);
      setResult(`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-32 right-8 h-12 w-12 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-500 to-lime-500 hover:from-lime-600 hover:to-green-600"
          size="icon">
          <CurrencyIcon className="h-8 w-8" />
          <span className="sr-only">Open currency converter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Currency Converter
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <Tabs defaultValue="convert" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="convert">Convert</TabsTrigger>
              <TabsTrigger value="rates">Exchange Rates</TabsTrigger>
            </TabsList>
            <TabsContent value="convert">
              <ScrollArea>
                <Card>
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="flex-grow"
                      />
                      <Select
                        value={fromCurrency}
                        onValueChange={setFromCurrency}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="From" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem
                              key={currency.code}
                              value={currency.code}>
                              {currency.flag} {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={swapCurrencies}>
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="To" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem
                              key={currency.code}
                              value={currency.code}>
                              {currency.flag} {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex-grow text-right font-mono text-xl">
                        <AnimatePresence>
                          <motion.div
                            key={result}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}>
                            {result.split("=")[1] || "0.00"}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="rates">
              <ScrollArea>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      Base: 1 XAF
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(rates).map(([code, rate]) => (
                        <div
                          key={code}
                          className="flex items-center justify-between p-2 border rounded">
                          <span>
                            {currencies.find((c) => c.code === code)?.flag ||
                              ""}{" "}
                            {code}
                          </span>
                          <span className="font-mono">{rate.toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
