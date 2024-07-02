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

  const addToCart = async () => {
    setIsAdding(true);
    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Log the added product
      console.log("Added to cart:", product);

      // Here you would typically update some state or make an API call
      // For example: await updateCartInAPI(product);

      setIsInCart(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const removeFromCart = async () => {
    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Removed from cart:", product);

      // Here you would typically update some state or make an API call
      // For example: await removeFromCartInAPI(product);

      setIsInCart(false);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return (
    <Link href={"/shop/product/" + slugify(product.name)} preload={true}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="relative w-full h-64">
          <Image
            src={"https://placehold.co/400x600.png"}
            alt={product.name}
            layout="fill"
            objectFit="cover"
          />
          {product.is_new && (
            <Badge className="absolute top-2 left-2 bg-green-500 text-white">
              New
            </Badge>
          )}
          {product.is_sale && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              Sale
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 truncate">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <div>
              {product.sale_price ? (
                <>
                  <span className="text-red-500 font-bold">
                    ${product.sale_price.toFixed(2)}
                  </span>
                  <span className="text-gray-500 line-through ml-2">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>
            {product.discount > 0 && (
              <Badge className="bg-yellow-500 text-white">
                {product.discount}% OFF
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          {product.colors && product.colors.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}></div>
              ))}
            </div>
          )}
          {product.sizable && product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {product.sizes.map((size) => (
                <Badge key={size} variant="outline" className="text-xs">
                  {size}
                </Badge>
              ))}
            </div>
          )}
          {!isInCart ? (
            <Button className="w-full" onClick={addToCart} disabled={isAdding}>
              {isAdding ? "Adding..." : "Add to Cart"}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={removeFromCart}
                variant="outline">
                Remove
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/cart">Go to Cart</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
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
    <section className="grid md:grid-cols-[25rem_1fr] gap-8 p-4 md:p-8 sm:p-6">
      <Filter
        selectedFilters={selectedFilters}
        handleFilterChange={handleFilterChange}
        clearAllFilters={clearAllFilters}
      />
      <div className="flex flex-col gap-4">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 gap-y-12">
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
