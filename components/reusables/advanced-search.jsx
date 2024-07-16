"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import slugify from "react-slugify";
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

const AdvancedSearchModal = ({ products, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const searchProducts = (term, productList) => {
    const lowercaseTerm = term.toLowerCase();
    return productList.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseTerm) ||
        product.description.toLowerCase().includes(lowercaseTerm) ||
        product.long_description.toLowerCase().includes(lowercaseTerm)
    );
  };

  useEffect(() => {
    setIsLoading(true);
    const debounce = setTimeout(() => {
      let results = searchTerm
        ? searchProducts(searchTerm, products)
        : products;

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

      setFilteredProducts(results);
      setIsLoading(false);

      if (results.length === 0) {
        toast({
          title: "No results found",
          description: "Try adjusting your search criteria",
          variant: "destructive",
        });
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [
    searchTerm,
    priceRange,
    selectedCategories,
    selectedColors,
    sortBy,
    products,
    toast,
  ]);

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

  const handleProductClick = (productId) => {
    router.push(`/en/shop/product/${productId}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
          <DialogDescription>
            Use the filters below to find the perfect product.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Price Range</Label>
            <Slider
              min={0}
              max={1000000}
              step={1000}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between mt-2">
              <span>{priceRange[0]} FCFA</span>
              <span>{priceRange[1]} FCFA</span>
            </div>
            <Progress
              value={(priceRange[1] / 1000000) * 100}
              className="mt-2"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="categories">
              <AccordionTrigger>Categories</AccordionTrigger>
              <AccordionContent>
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([
                            ...selectedCategories,
                            category,
                          ]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== category)
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {category}
                    </Label>
                  </div>
                ))}
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
                          <Button
                            variant="outline"
                            className={`w-6 h-6 rounded-full p-0 ${
                              selectedColors.includes(color)
                                ? "ring-2 ring-offset-2 ring-black"
                                : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              if (selectedColors.includes(color)) {
                                setSelectedColors(
                                  selectedColors.filter((c) => c !== color)
                                );
                              } else {
                                setSelectedColors([...selectedColors, color]);
                              }
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Select onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          <div>
            <h2 className="text-lg font-semibold mb-2">
              Results ({filteredProducts.length})
            </h2>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-[60px] w-full" />
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {filteredProducts.slice(0, 5).map((product) => (
                  <motion.li
                    key={product.id}
                    className="product-item"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Card
                            onClick={() =>
                              handleProductClick(slugify(product.name))
                            }
                            className="cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  {product.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {product.price} FCFA
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{product.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearchModal;
