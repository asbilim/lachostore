"use client";
import { useState, useMemo, useCallback } from "react";
import Filter from "./filter";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbComponent as Breadcrumb } from "@/components/reusables/breadcrumbs";
import { Link } from "@/components/navigation";
import slugify from "react-slugify";
import { useCart } from "@/hooks/use-cart";
import { FilterIcon, X } from "lucide-react";

const ProductCard = ({ product, locale }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { cart, addToCart, removeFromCart } = useCart();
  const isInCart = cart.some((item) => item.id === product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const c = await addToCart(product);
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
          {salePrice.toLocaleString()} FCFA
        </span>
        <span className="text-green-600 line-through ml-2">
          {price.toLocaleString()} FCFA
        </span>
      </>
    ) : (
      <span className="text-green-900 font-bold">
        {price.toLocaleString()} FCFA
      </span>
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

export default function MainShop({ products, locale }) {
  const breadcrumbItems = [
    { type: "link", label: "Home", href: "/" + locale },
    { type: "link", label: "Products", href: locale + "/products/" },
  ];
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    price: { min: 0, max: 100000 },
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
        product.price < selectedFilters.price.min ||
        product.price > selectedFilters.price.max
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
    <section className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-green-100 rounded-lg p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Bienvenue dans notre boutique
        </h1>
        <p className="text-xl mb-4">Découvrez notre dernière collection !</p>
        <Button>Achetez maintenant</Button>
      </div>

      {/* Filter and Product Grid */}
      <div className="mb-6 flex justify-between items-center">
        <Filter
          selectedFilters={selectedFilters}
          handleFilterChange={handleFilterChange}
          clearAllFilters={clearAllFilters}
        />
        <span className="text-sm text-gray-500">
          {filteredProducts.length} produits
        </span>
      </div>

      {/* Selected Filters Display */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(selectedFilters).map(([key, value]) =>
          Array.isArray(value)
            ? value.map((item) => (
                <Badge
                  key={`${key}-${item}`}
                  variant="secondary"
                  className="px-2 py-1">
                  {item}{" "}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange(key, item)}
                  />
                </Badge>
              ))
            : null
        )}
        {(selectedFilters.price.min > 0 ||
          selectedFilters.price.max < 100000) && (
          <Badge variant="secondary" className="px-2 py-1">
            {selectedFilters.price.min.toLocaleString()} -{" "}
            {selectedFilters.price.max.toLocaleString()} FCFA
            <X
              className="ml-1 h-3 w-3 cursor-pointer"
              onClick={() =>
                handleFilterChange("price", { min: 0, max: 100000 })
              }
            />
          </Badge>
        )}
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
