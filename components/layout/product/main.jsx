"use client";
import { useState } from "react";
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
import { Star, TruckIcon, ShieldCheck, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProductDetails from "./parts";

const images = [{}, {}, {}, {}];

export default function Main(props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const breadcrumbItems = [
    { type: "link", label: "Home", href: "/" },
    { type: "link", label: "Shop", href: "/products/" },
    { type: "link", label: "Products", href: "/products/" },
    { type: "text", label: props.product.name },
  ];

  return (
    <div className="flex w-full my-12 flex-col items-center justify-center py-3">
      <div className="flex w-full max-w-7xl flex-col gap-6">
        <BreadcrumbComponent items={breadcrumbItems} />
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{props.product.name}</h1>
          <Badge variant="outline" className="text-sm">
            {props.product.category}
          </Badge>
        </div>
      </div>
      <div className="grid md:grid-cols-2 w-full gap-6 lg:gap-12 items-start max-w-7xl mx-auto py-6">
        <div className="grid gap-4 w-full">
          <div className="relative">
            <Image
              src="https://placehold.co/400x600.png"
              alt="Product Image"
              width={600}
              height={900}
              className="aspect-[3/3] object-cover w-full rounded-lg overflow-hidden"
            />
            {props.product.isNew && (
              <Badge className="absolute top-4 left-4">New Arrival</Badge>
            )}
          </div>
          <div className="flex justify-between gap-3 overflow-x-auto scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                className={`border hover:border-primary rounded-lg overflow-hidden transition-colors ${
                  index === selectedImage
                    ? "border-primary"
                    : "border-muted hover:border-primary"
                }`}
                onClick={() => setSelectedImage(index)}>
                <Image
                  src="https://placehold.co/400x600.png"
                  alt={`Thumbnail ${index + 1}`}
                  width={100}
                  height={120}
                  className="aspect-[5/6] object-cover"
                />
                <span className="sr-only">View Image {index + 1}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:gap-10 items-start">
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-primary text-2xl font-bold">
                  FCFA {props.product.price}
                </h2>
                {props.product.sale_price && (
                  <h2 className="line-through text-gray-500 text-lg">
                    {props.product.sale_price}
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
                  ({props.product.reviewCount} reviews)
                </span>
              </div>
            </div>
            <p className="text-gray-600">{props.product.description}</p>
          </div>
          <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg">
            <Avatar>
              <AvatarImage src={props.product.vendor.avatar} />
              <AvatarFallback>{props.product.vendor.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{props.product.vendor.name}</p>
              <p className="text-sm text-gray-600">
                {props.product.vendor.location}
              </p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              View Store
            </Button>
          </div>
          <form className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="color" className="text-base">
                Color
              </Label>
              <RadioGroup
                id="color"
                defaultValue="black"
                className="flex items-center gap-2">
                {["black", "white", "blue"].map((color) => (
                  <Label
                    key={color}
                    htmlFor={`color-${color}`}
                    className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted">
                    <RadioGroupItem id={`color-${color}`} value={color} />
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="size" className="text-base">
                Size
              </Label>
              <RadioGroup
                id="size"
                defaultValue="m"
                className="flex items-center gap-2">
                {["xs", "s", "m", "l", "xl"].map((size) => (
                  <Label
                    key={size}
                    htmlFor={`size-${size}`}
                    className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted">
                    <RadioGroupItem id={`size-${size}`} value={size} />
                    {size.toUpperCase()}
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity" className="text-base">
                Quantity
              </Label>
              <div className="flex items-center gap-4">
                <Select defaultValue="1">
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">
                  {props.product.stock} items available
                </span>
              </div>
            </div>
            <Button size="lg">Add to cart</Button>
          </form>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <TruckIcon className="w-5 h-5" />
              Free shipping over FCFA 50,000
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              30-day return policy
            </div>
          </div>
        </div>
      </div>
      <ProductDetails product={props.product} />
    </div>
  );
}
