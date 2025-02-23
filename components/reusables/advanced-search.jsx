"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import slugify from "react-slugify";
import Image from "next/image";
import { Search, X } from "lucide-react";
// shadcn components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useCurrency } from "@/providers/currency";

const AdvancedSearchModal = ({ products, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currency, convertCurrency } = useCurrency();

  // Add new states for enhanced UX
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const router = useRouter();
  const { toast } = useToast();

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products]
  );
  const colors = useMemo(
    () => [...new Set(products.flatMap((product) => product.colors))],
    [products]
  );

  // Memoize the filtered results computation
  const computeFilteredResults = useCallback(() => {
    let results = products;

    if (searchTerm) {
      const lowercaseTerm = searchTerm.toLowerCase();
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercaseTerm) ||
          product.description.toLowerCase().includes(lowercaseTerm)
      );
    }

    results = results.filter(
      (product) =>
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        (selectedCategories.length === 0 ||
          selectedCategories.includes(product.category)) &&
        (selectedColors.length === 0 ||
          product.colors.some((color) => selectedColors.includes(color)))
    );

    if (sortBy === "price-asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    }

    return results;
  }, [
    searchTerm,
    priceRange,
    selectedCategories,
    selectedColors,
    sortBy,
    products,
  ]);

  // Update filtered products with debounce
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const results = computeFilteredResults();
      setFilteredProducts(results);
      setIsLoading(false);

      if (results.length === 0 && searchTerm) {
        toast({
          title: "No results found",
          description: "Try adjusting your search criteria",
          variant: "destructive",
        });
      }
    }, 150); // Reduced debounce time for better responsiveness

    return () => clearTimeout(timer);
  }, [computeFilteredResults, searchTerm, toast]);

  useEffect(() => {
    if (filteredProducts.length && !isLoading) {
      gsap.from(".product-item", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }, [filteredProducts, isLoading]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredProducts.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      handleProductClick(slugify(filteredProducts[activeIndex].name));
    }
  };

  const handleProductClick = (productId) => {
    router.push(`/en/shop/product/${productId}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
          <DialogDescription>
            Use the filters below to find the perfect product.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="search"
                type="text"
                className="pl-10 pr-10"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onKeyDown={handleKeyDown}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 hover:bg-transparent"
                  onClick={() => setSearchTerm("")}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label>Price Range</Label>
                <div className="px-2">
                  <Slider
                    min={0}
                    max={1000000}
                    step={1000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>
                    {currency} {convertCurrency(priceRange[0], "XAF", currency)}
                  </span>
                  <span>
                    {currency} {convertCurrency(priceRange[1], "XAF", currency)}
                  </span>
                </div>
              </div>

              <Select onValueChange={setSortBy} value={sortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="categories">
                  <AccordionTrigger>Categories</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => {
                              setSelectedCategories(
                                checked
                                  ? [...selectedCategories, category]
                                  : selectedCategories.filter(
                                      (c) => c !== category
                                    )
                              );
                            }}
                          />
                          <Label htmlFor={`category-${category}`}>
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="colors">
                  <AccordionTrigger>Colors</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <TooltipProvider key={color}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-8 h-8 rounded-full ${
                                  selectedColors.includes(color)
                                    ? "ring-2 ring-offset-2 ring-black"
                                    : ""
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  setSelectedColors(
                                    selectedColors.includes(color)
                                      ? selectedColors.filter(
                                          (c) => c !== color
                                        )
                                      : [...selectedColors, color]
                                  );
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>{color}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">
              Results ({filteredProducts.length})
            </h2>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <Skeleton key={index} className="h-[100px] w-full" />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {filteredProducts.slice(0, 6).map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`product-item ${
                          index === activeIndex ? "ring-2 ring-primary" : ""
                        }`}>
                        <Card
                          onClick={() =>
                            handleProductClick(slugify(product.name))
                          }
                          className="cursor-pointer hover:shadow-lg transition-shadow">
                          <CardContent className="p-4 flex items-center space-x-4">
                            {product.images && product.images[0] && (
                              <div className="relative w-20 h-20">
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {product.description}
                              </p>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="font-bold text-primary">
                                  {currency}{" "}
                                  {convertCurrency(
                                    product.price,
                                    "XAF",
                                    currency
                                  )}
                                </span>
                                {product.rating && (
                                  <div className="flex items-center">
                                    <span className="text-yellow-400">★</span>
                                    <span className="ml-1 text-sm">
                                      {product.rating}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearchModal;
