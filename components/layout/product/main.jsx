"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReferralModal } from "@/components/referral";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  TwitterIcon as Twitter,
  FacebookIcon as Facebook,
  WhatsappIcon as Whatsapp,
} from "react-share";
import { usePathname } from "next/navigation";

import { BreadcrumbComponent } from "@/components/reusables/breadcrumbs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import jwt from "jsonwebtoken";

import { Star, TruckIcon, ShieldCheck, Share2, Gift, Mail } from "lucide-react";

import ProductDetails from "./parts";
import { useCart } from "@/providers/cart";
import { useToast } from "@/components/ui/use-toast";
import { useCurrency } from "@/providers/currency";
import { Link } from "@/components/navigation";
import { handleProductVisit } from "@/components/functions/api";
import { useSession } from "next-auth/react";
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function ImprovedProductPage({ product, translations, locale }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const { toast } = useToast();
  const { currency, convertCurrency } = useCurrency();
  const pathname = usePathname();
  const { data: session } = useSession();

  const extra_url =
    `https://shop.lachofit.com${pathname}?from=${session?.referral_code}` ||
    `https://shop.lachofit.com${pathname}`;

  console.log(extra_url);

  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [imageRef, imageInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [detailsRef, detailsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const breadcrumbItems = [
    { type: "link", label: "Home", href: "/" },
    { type: "link", label: "Shop", href: `/${locale}/products/` },
    { type: "link", label: "Products", href: `/${locale}/products/` },
    { type: "text", label: product.name },
  ];

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      quantity,
      color: selectedColor,
      size: selectedSize,
      price: product.price,
      sale_price: product.sale_price,
    });
    toast({
      title: "Product added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromCart = (e) => {
    e.preventDefault();
    removeFromCart(product.id);
    toast({
      title: "Product removed from cart",
      description: `${product.name} has been removed from your cart.`,
      variant: "destructive",
    });
  };

  const handleImageChange = (index) => {
    setSelectedImage(index);
  };

  const handleImageHover = () => {
    setIsZoomed(true);
  };

  const handleImageLeave = () => {
    setIsZoomed(false);
  };

  const isProductInCart = cart.some((item) => item.id === product.id);

  const stockLevel =
    product.stock <= 5 ? "Low" : product.stock <= 20 ? "Medium" : "High";
  const stockColor =
    product.stock <= 5
      ? "bg-red-500"
      : product.stock <= 20
      ? "bg-yellow-500"
      : "bg-green-500";

  useEffect(() => {
    handleProductVisit(product.id);
  }, [product.id]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex w-full my-6 md:my-12 flex-col items-center justify-center py-3 px-4 md:px-0">
      <Card className="w-full max-w-7xl">
        <CardContent className="p-6">
          <BreadcrumbComponent items={breadcrumbItems} />
          <motion.div
            ref={titleRef}
            initial="hidden"
            animate={titleInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0">
              {product.name}
            </h1>
            <Badge variant="outline" className="text-sm">
              {product.category}
            </Badge>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-start mt-6">
            <motion.div
              ref={imageRef}
              initial="hidden"
              animate={imageInView ? "visible" : "hidden"}
              variants={fadeInUp}
              className="space-y-4">
              <motion.div
                className="relative overflow-hidden rounded-lg aspect-square"
                onHoverStart={handleImageHover}
                onHoverEnd={handleImageLeave}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full">
                    <Image
                      src={
                        product.images[selectedImage].image ||
                        "https://placehold.co/400x400.png"
                      }
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className={`transition-transform duration-300 ${
                        isZoomed ? "scale-110" : "scale-100"
                      }`}
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>
                {product.is_new && (
                  <Badge className="absolute top-4 left-4">New Arrival</Badge>
                )}
              </motion.div>
              <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                <div className="flex w-max space-x-4 p-4">
                  <AnimatePresence>
                    {product.images &&
                      product.images.map((image, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                            index === selectedImage
                              ? "border-primary"
                              : "border-muted hover:border-primary"
                          }`}
                          onClick={() => handleImageChange(index)}>
                          <Image
                            src={image.image}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            unoptimized
                          />
                          <span className="sr-only">
                            View Image {index + 1}
                          </span>
                        </motion.button>
                      ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </motion.div>

            <motion.div
              ref={detailsRef}
              initial="hidden"
              animate={detailsInView ? "visible" : "hidden"}
              variants={stagger}
              className="space-y-6">
              <motion.div variants={fadeInUp} className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex items-center gap-2 mb-2 sm:mb-0">
                    <h2 className="text-primary text-xl md:text-2xl font-bold">
                      {currency}{" "}
                      {parseFloat(
                        convertCurrency(product.price, "XAF", currency)
                      ).toFixed(2)}
                    </h2>
                    {product.sale_price && (
                      <h2 className="line-through text-gray-500 text-base md:text-lg">
                        {currency}{" "}
                        {parseFloat(
                          convertCurrency(product.sale_price, "XAF", currency)
                        ).toFixed(2)}
                      </h2>
                    )}
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 md:w-5 md:h-5 ${
                          star <= product.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-xs md:text-sm text-gray-600">
                      ({product.review_count} reviews)
                    </span>
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-600">
                  {product.description}
                </p>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src={product.vendor.avatar}
                        alt={product.vendor.name}
                      />
                      <AvatarFallback>{product.vendor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <p className="font-semibold text-sm md:text-base">
                        {product.vendor.name}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">
                        {product.vendor.address}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/mystore/${product.vendor.slug}`}>
                        View Store
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.form variants={fadeInUp} className="space-y-6">
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="color" className="text-sm md:text-base">
                      {translations.color}
                    </Label>
                    <RadioGroup
                      id="color"
                      value={selectedColor}
                      onValueChange={setSelectedColor}
                      className="flex flex-wrap items-center gap-2">
                      {product.colors.map((color) => (
                        <Label
                          key={color}
                          htmlFor={`color-${color}`}
                          className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted transition-colors duration-200 text-xs md:text-sm">
                          <RadioGroupItem id={`color-${color}`} value={color} />
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="size" className="text-sm md:text-base">
                      {translations.size}
                    </Label>
                    <RadioGroup
                      id="size"
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                      className="flex flex-wrap items-center gap-2">
                      {product.sizes.map((size) => (
                        <Label
                          key={size}
                          htmlFor={`size-${size}`}
                          className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted transition-colors duration-200 text-xs md:text-sm">
                          <RadioGroupItem id={`size-${size}`} value={size} />
                          {size.toUpperCase()}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm md:text-base">
                    {translations.quantity}
                  </Label>
                  <div className="flex items-center gap-4">
                    <Select
                      value={quantity.toString()}
                      onValueChange={(value) =>
                        setQuantity(Math.min(parseInt(value), product.stock))
                      }>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          { length: product.stock },
                          (_, i) => i + 1
                        ).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-xs md:text-sm text-gray-600">
                      {product.stock} {translations.available}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div
                            className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${stockColor}`}></div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {translations.stock}: {stockLevel}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {isProductInCart ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      variant="destructive"
                      onClick={handleRemoveFromCart}
                      className="w-full sm:w-auto transition-colors duration-300 text-sm md:text-base">
                      Remove from Cart
                    </Button>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-primary hover:bg-primary-dark transition-colors duration-300 text-sm md:text-base"
                      asChild>
                      <Link href="/cart">Continue to Cart</Link>
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-primary hover:bg-primary-dark transition-colors duration-300 text-sm md:text-base"
                    onClick={handleAddToCart}>
                    Add to Cart
                  </Button>
                )}
              </motion.form>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-2 w-full sm:w-auto">
                        <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                        Share
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="flex gap-2">
                        <FacebookShareButton url={extra_url}>
                          <Facebook size={24} />
                        </FacebookShareButton>
                        <TwitterShareButton url={extra_url}>
                          <Twitter size={24} />
                        </TwitterShareButton>
                        <WhatsappShareButton url={extra_url}>
                          <Whatsapp size={24} />
                        </WhatsappShareButton>
                        <EmailShareButton url={extra_url}>
                          <Mail size={24} />
                        </EmailShareButton>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <ReferralModal
                  productName={product?.name}
                  commission="5%"
                  session={session}
                  triggerChildren={
                    <Button
                      variant="text"
                      size="lg"
                      className="flex items-center gap-2 w-full sm:w-auto text-sm md:text-base">
                      <Gift className="w-4 h-4 md:w-5 md:h-5" />
                      Refer & start Earning
                    </Button>
                  }
                />
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row justify-between items-center text-xs md:text-sm text-gray-600">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <TruckIcon className="w-4 h-4 md:w-5 md:h-5" />
                  {translations.free_shipping}
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                  {translations.return_policy}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-7xl mt-8">
        <CardContent className="p-6">
          <ProductDetails product={product} translations={translations} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
