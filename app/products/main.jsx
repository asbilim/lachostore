"use client";
import { useState, useMemo, useCallback } from "react";
import Filter from "./filter";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbComponent as Breadcrumb } from "@/components/reusables/breadcrumbs";
import Link from "next/link";
import slugify from "react-slugify";

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent link navigation
    setIsAdding(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Added to cart:", product);
      setIsInCart(true);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFromCart = async (e) => {
    e.preventDefault(); // Prevent link navigation
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Removed from cart:", product);
      setIsInCart(false);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full max-w-xs mx-auto mb-8">
      <div className="bg-green-100 border border-green-300 p-4 transition-all duration-300 hover:shadow-md">
        <Link href={`/shop/product/${slugify(product.name)}`}>
          <div className="relative aspect-square w-full mb-4 overflow-hidden">
            <Image
              src={product.image_url || "https://placehold.co/400x400.png"}
              alt={product.name}
              layout="fill"
              objectFit={product.is_transparent ? "contain" : "cover"}
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
            {(product.is_new || product.is_sale || product.discount > 0) && (
              <div className="absolute top-0 left-0 bg-green-800 text-green-100 text-xs px-2 py-1">
                {product.is_new
                  ? "New"
                  : product.is_sale
                  ? "Sale"
                  : `${product.discount}% OFF`}
              </div>
            )}
          </div>
        </Link>
        <h3 className="font-serif text-xl mb-2 text-green-900">
          {product.name}
        </h3>
        <div className="flex justify-between items-center mb-3">
          <PriceDisplay price={product.price} salePrice={product.sale_price} />
        </div>
        <p className="text-sm text-green-700 mb-4 line-clamp-2">
          {product.description}
        </p>
        <ProductVariants
          colors={product.colors}
          sizes={product.sizes}
          sizable={product.sizable}
        />
        <CartActions
          isInCart={isInCart}
          isAdding={isAdding}
          onAdd={handleAddToCart}
          onRemove={handleRemoveFromCart}
        />
      </div>
    </div>
  );
};

const PriceDisplay = ({ price, salePrice }) => (
  <div className="font-mono">
    {salePrice ? (
      <>
        <span className="text-green-900 font-bold">
          ${salePrice.toFixed(2)}
        </span>
        <span className="text-green-600 line-through ml-2">
          ${price.toFixed(2)}
        </span>
      </>
    ) : (
      <span className="text-green-900 font-bold">${price.toFixed(2)}</span>
    )}
  </div>
);

const ProductVariants = ({ colors, sizes, sizable }) => (
  <div className="mb-4">
    {colors && colors.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-2">
        {colors.map((color) => (
          <div
            key={color}
            className="w-4 h-4 rounded-full border border-green-300 cursor-pointer"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    )}
    {sizable && sizes && sizes.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <span
            key={size}
            className="text-xs border border-green-300 px-2 py-1">
            {size}
          </span>
        ))}
      </div>
    )}
  </div>
);

const CartActions = ({ isInCart, isAdding, onAdd, onRemove }) => (
  <>
    {!isInCart ? (
      <Button
        className="w-full bg-green-800 text-green-100 py-2 transition-colors duration-300 hover:bg-green-900 disabled:bg-green-400"
        onClick={onAdd}
        disabled={isAdding}>
        {isAdding ? "Adding..." : "Add to Cart"}
      </Button>
    ) : (
      <div className="flex gap-2">
        <button
          className="flex-1 bg-green-400 text-green-100 py-2 transition-colors duration-300 hover:bg-green-800"
          onClick={onRemove}>
          Remove
        </button>
        <Link
          href="/cart"
          className="flex-1 bg-green-800 text-green-100 py-2 text-center transition-colors duration-300 hover:bg-green-900">
          View Cart
        </Link>
      </div>
    )}
  </>
);

export default function MainShop({ products }) {
  const breadcrumbItems = [
    { type: "link", label: "Home", href: "/" },
    { type: "link", label: "Products", href: "/products/" },
  ];
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    price: { min: 0, max: 500 },
    color: [],
    size: [],
  });
  const [displayCount, setDisplayCount] = useState(10);

  const handleFilterChange = useCallback((type, value) => {
    setSelectedFilters((prev) => {
      switch (type) {
        case "category":
        case "color":
        case "size":
          return {
            ...prev,
            [type]: prev[type].includes(value)
              ? prev[type].filter((item) => item !== value)
              : [...prev[type], value],
          };
        case "price":
          return {
            ...prev,
            price: value,
          };
        default:
          return prev;
      }
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedFilters({
      category: [],
      price: { min: 0, max: 500 },
      color: [],
      size: [],
    });
  }, []);

  const loadMore = useCallback(() => {
    setDisplayCount((prevCount) => prevCount + 10);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        selectedFilters.category.length > 0 &&
        !selectedFilters.category.includes(product.category)
      ) {
        return false;
      }
      if (
        product.price < selectedFilters.price.min * 100 ||
        product.price > selectedFilters.price.max * 100
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
  }, [selectedFilters, products]);

  const productsToShow = filteredProducts.slice(0, displayCount);

  return (
    <section className="grid md:grid-cols-[20rem_1fr] gap-8 p-4 md:p-8 sm:p-6">
      <Filter
        selectedFilters={selectedFilters}
        handleFilterChange={handleFilterChange}
        clearAllFilters={clearAllFilters}
      />
      <div className="flex flex-col gap-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-12">
          {productsToShow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {displayCount < filteredProducts.length && (
          <div className="flex justify-center mt-6">
            <Button onClick={loadMore}>Load More</Button>
          </div>
        )}
      </div>
    </section>
  );
}
