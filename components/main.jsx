"use client";
import React, { useState, useMemo, useCallback } from "react";
import Filter from "./layout/product/filter";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/components/navigation";
import slugify from "react-slugify";
import { useCart } from "@/hooks/use-cart";
import HeroShop from "./hero";
import { useCurrency } from "@/providers/currency";

export const ProductCard = ({ product, locale }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { cart, addToCart, removeFromCart, error } = useCart();
  const isInCart = cart.some((item) => item.id === product.id);

  const { currency, convertCurrency } = useCurrency();

  if (error) {
    alert(error);
  }

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    await addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      sale_price: product.sale_price,
      color: product.colors[0],
      sizes: product?.sizes[0],
      quantity: 1,
    });
    setIsAdding(false);
  };

  const handleRemoveFromCart = async (e) => {
    e.preventDefault();
    await removeFromCart(product.id);
  };

  return (
    <div className="w-full max-w-xs mx-auto mb-8">
      <div className="bg-green-100 border border-green-300 p-4 transition-all duration-300 hover:shadow-md">
        <Link href={`/shop/product/${slugify(product.name)}`} locale={locale}>
          <div className="relative aspect-square w-full mb-4 overflow-hidden">
            <Image
              src={product.image || "https://placehold.co/400x400.png"}
              alt={product.name}
              layout="fill"
              objectFit={product.transparent_image ? "contain" : "cover"}
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
            {(product.is_new || product.is_sale || product.discount > 0) && (
              <div className="absolute top-0 left-0 bg-green-800 text-green-100 text-xs px-2 py-1">
                {product.is_new
                  ? "New"
                  : product.is_sale
                  ? "Sale"
                  : `${product.discount} FCFA OFF`}
              </div>
            )}
          </div>
        </Link>
        <h3 className="font-serif text-xl mb-2 text-green-900">
          {product.name}
        </h3>
        <div className="flex justify-between items-center mb-3">
          <div className="font-mono">
            {product.sale_price ? (
              <>
                <span className="text-green-900 font-bold">
                  {parseFloat(
                    convertCurrency(product.sale_price, "XAF", currency)
                  ).toFixed(2)}
                  {currency + " "}
                </span>
                <span className="text-green-600 line-through ml-2">
                  {parseFloat(
                    convertCurrency(product.price, "XAF", currency)
                  ).toFixed(2)}
                  {currency + " "}
                </span>
              </>
            ) : (
              <span className="text-green-900 font-bold">
                {parseFloat(
                  convertCurrency(product.price, "XAF", currency)
                ).toFixed(2)}
                {currency + " "}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-green-700 mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="mb-4">
          {product.colors && product.colors.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className="w-4 h-4 rounded-full border border-green-300 cursor-pointer"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          )}
          {product.sizable && product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className="text-xs border border-green-300 px-2 py-1">
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>
        {!isInCart ? (
          <Button
            className="w-full bg-green-800 text-green-100 py-2 transition-colors duration-300 hover:bg-green-900 disabled:bg-green-400"
            onClick={handleAddToCart}
            disabled={isAdding}>
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>
        ) : (
          <div className="flex gap-2">
            <button
              className="flex-1 bg-green-400 text-green-100 py-2 transition-colors duration-300 hover:bg-green-800"
              onClick={handleRemoveFromCart}>
              Remove
            </button>
            <Link
              href="/cart"
              className="flex-1 bg-green-800 text-green-100 py-2 text-center transition-colors duration-300 hover:bg-green-900">
              View Cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default function MainShop({
  products,
  locale,
  title,
  description,
  link_1,
  link_2,
  prod,
  filters,
}) {
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    price: { min: 0, max: 1000000 },
    color: [],
    size: [],
  });
  const [displayCount, setDisplayCount] = useState(10);

  const handleFilterChange = useCallback((type, value, checked = null) => {
    setSelectedFilters((prev) => {
      const newFilters = {
        ...prev,
        [type]:
          checked !== null
            ? checked
              ? [...prev[type], value]
              : prev[type].filter((item) => item !== value)
            : prev[type].includes(value)
            ? prev[type].filter((item) => item !== value)
            : [...prev[type], value],
      };
      console.log("Updated filters:", newFilters);
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedFilters({
      category: [],
      price: { min: 0, max: 1000000 },
      color: [],
      size: [],
    });
    console.log("Filters cleared");
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const category = product.name.split(" ")[0]; // Assuming first word is category
      if (
        selectedFilters.category.length > 0 &&
        !selectedFilters.category.includes(category)
      ) {
        return false;
      }
      if (
        parseFloat(product.price) < selectedFilters.price.min ||
        parseFloat(product.price) > selectedFilters.price.max
      ) {
        return false;
      }
      if (
        selectedFilters.color.length > 0 &&
        !product.colors.some((color) => selectedFilters.color.includes(color))
      ) {
        return false;
      }
      if (
        selectedFilters.size.length > 0 &&
        !product.sizes.some((size) => selectedFilters.size.includes(size))
      ) {
        return false;
      }
      return true;
    });
    return filtered;
  }, [selectedFilters, products]);

  const productsToShow = useMemo(() => {
    const slicedProducts = filteredProducts.slice(0, displayCount);
    console.log("Products to show:", slicedProducts);
    return slicedProducts;
  }, [filteredProducts, displayCount]);

  const loadMore = useCallback(() => {
    setDisplayCount((prevCount) => {
      const newCount = prevCount + 10;
      console.log("New display count:", newCount);
      return newCount;
    });
  }, []);

  return (
    <section className="container mx-auto px-4 py-8">
      <HeroShop
        title={title}
        description={description}
        link_1={link_1}
        link_2={link_2}
      />
      <div className="mb-6 flex gap-3 justify-between items-center">
        <Filter
          products={products}
          selectedFilters={selectedFilters}
          handleFilterChange={handleFilterChange}
          clearAllFilters={clearAllFilters}
          filters={filters}
        />
        <span className="text-sm text-gray-500 text-center">
          {filteredProducts.length} {prod}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsToShow.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>

      {displayCount < filteredProducts.length && (
        <div className="flex justify-center mt-8">
          <Button onClick={loadMore} variant="outline">
            Charger plus
          </Button>
        </div>
      )}
    </section>
  );
}
