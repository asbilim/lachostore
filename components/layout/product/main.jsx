"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
import { Star, TruckIcon, ShieldCheck, Share2, Gift } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProductDetails from "./parts";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCart } from "@/providers/cart";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "@/components/navigation";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";

export default function Main(props) {
  const { cart, addToCart, removeFromCart } = useCart();
  const { toast } = useToast();

  const translations = props.translations;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(props.product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(props.product.sizes[0]);
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
    { type: "link", label: "Shop", href: "/" + props.locale + "/products/" },
    {
      type: "link",
      label: "Products",
      href: "/" + props.locale + "/products/",
    },
    { type: "text", label: props.product.name },
  ];

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      id: props.product.id,
      name: props.product.name,
      image: props.product.image,
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
      price: props.product.price,
      sale_price: props.product.sale_price,
    });
    toast({
      title: "Product added to cart",
      description: `${props.product.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromCart = (e) => {
    e.preventDefault();
    removeFromCart(props.product.id);
  };

  const isProductInCart = cart.some((item) => item.id === props.product.id);

  const stockLevel = () => {
    if (props.product.stock <= 5) return "Low";
    if (props.product.stock <= 20) return "Medium";
    return "High";
  };

  const stockColor = () => {
    if (props.product.stock <= 5) return "bg-red-500";
    if (props.product.stock <= 20) return "bg-yellow-500";
    return "bg-green-500";
  };

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex w-full my-12 flex-col items-center justify-center py-3 px-4 md:px-0">
      <div className="flex w-full max-w-7xl flex-col gap-6">
        <BreadcrumbComponent items={breadcrumbItems} />
        <motion.div
          ref={titleRef}
          initial="hidden"
          animate={titleInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold mb-2 md:mb-0">
            {props.product.name}
          </h1>
          <Badge variant="outline" className="text-sm">
            {props.product.category}
          </Badge>
        </motion.div>
      </div>
      <div className="grid md:grid-cols-2 w-full gap-6 lg:gap-12 items-start max-w-7xl mx-auto py-6">
        <motion.div
          ref={imageRef}
          initial="hidden"
          animate={imageInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="grid gap-4 w-full">
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={props.product.image}
              alt="Product Image"
              width={600}
              height={900}
              className="aspect-[3/3] object-cover w-full transition-transform duration-300 hover:scale-105"
            />
            {props.product.is_new && (
              <Badge className="absolute top-4 left-4">New Arrival</Badge>
            )}
          </div>
          <AnimatePresence>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-between gap-3 overflow-x-auto scrollbar-hide">
              {props.product.images &&
                props.product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`border rounded-lg overflow-hidden transition-colors ${
                      index === selectedImage
                        ? "border-primary"
                        : "border-muted hover:border-primary"
                    }`}
                    onClick={() => handleImageClick(index)}>
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={100}
                      height={120}
                      className="aspect-[5/6] object-cover"
                    />
                    <span className="sr-only">View Image {index + 1}</span>
                  </motion.button>
                ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <motion.div
          ref={detailsRef}
          initial="hidden"
          animate={detailsInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid gap-6 md:gap-10 items-start">
          <motion.div variants={fadeInUp} className="grid gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-primary text-2xl font-bold">
                  FCFA {parseFloat(props.product.price).toLocaleString()}
                </h2>
                {props.product.sale_price && (
                  <h2 className="line-through text-gray-500 text-lg">
                    FCFA {parseFloat(props.product.sale_price).toLocaleString()}
                  </h2>
                )}
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= props.product.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({props.product.review_count} reviews)
                </span>
              </div>
            </div>
            <p className="text-gray-600">{props.product.description}</p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg hover:shadow-md transition-shadow duration-300">
            <Avatar>
              <AvatarImage src={props.product.vendor.avatar} />
              <AvatarFallback>{props.product.vendor.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{props.product.vendor.name}</p>
              <p className="text-sm text-gray-600">
                {props.product.vendor.address}
              </p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              View Store
            </Button>
          </motion.div>
          <motion.form variants={fadeInUp} className="grid gap-6">
            {props.product.colors && props.product.colors.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="color" className="text-base">
                  {translations.color}
                </Label>
                <RadioGroup
                  id="color"
                  value={selectedColor}
                  onValueChange={setSelectedColor}
                  className="flex flex-wrap items-center gap-2">
                  {props.product.colors.map((color) => (
                    <Label
                      key={color}
                      htmlFor={`color-${color}`}
                      className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted transition-colors duration-200">
                      <RadioGroupItem id={`color-${color}`} value={color} />
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            )}
            {props.product.sizes && props.product.sizes.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="size" className="text-base">
                  {translations.size}
                </Label>
                <RadioGroup
                  id="size"
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  className="flex flex-wrap items-center gap-2">
                  {props.product.sizes.map((size) => (
                    <Label
                      key={size}
                      htmlFor={`size-${size}`}
                      className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted transition-colors duration-200">
                      <RadioGroupItem id={`size-${size}`} value={size} />
                      {size.toUpperCase()}
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="quantity" className="text-base">
                {translations.quantity}
              </Label>
              <div className="flex items-center gap-4">
                <Select
                  value={quantity.toString()}
                  onValueChange={(value) =>
                    setQuantity(Math.min(parseInt(value), props.product.stock))
                  }>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: props.product.stock },
                      (_, i) => i + 1
                    ).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">
                  {props.product.stock} {translations.available}
                </span>
                <div className={`w-4 h-4 rounded-full ${stockColor()}`}></div>
                <span className="text-sm text-gray-600">
                  {translations.stock}: {stockLevel()}
                </span>
              </div>
            </div>
            {isProductInCart ? (
              <div className="flex gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleRemoveFromCart}
                  className="bg-red-500 hover:bg-red-700 transition-colors duration-300">
                  Remove
                </Button>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-dark transition-colors duration-300">
                  <Link href="/cart">Continue to Cart</Link>
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-dark transition-colors duration-300"
                onClick={handleAddToCart}>
                Add to cart
              </Button>
            )}
          </motion.form>
          <motion.div variants={fadeInUp} className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share
              <div className="flex gap-2">
                <FacebookShareButton url={window.location.href}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={window.location.href}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <WhatsappShareButton url={window.location.href}>
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <EmailShareButton url={window.location.href}>
                  <EmailIcon size={32} round />
                </EmailShareButton>
              </div>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Refer & Earn
            </Button>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <TruckIcon className="w-5 h-5" />
              {translations.free_shipping}
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              {translations.return_policy}
            </div>
          </motion.div>
        </motion.div>
      </div>
      <ProductDetails product={props.product} translations={translations} />
    </motion.div>
  );
}
