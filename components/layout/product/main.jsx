"use client";
import { BreadcrumbComponent } from "@/components/reusables/breadcrumbs";
import { useState } from "react";
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
import Image from "next/image";

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
      <div className="flex w-full max-w-6xl  flex-col gap-6">
        <BreadcrumbComponent items={breadcrumbItems} />
        <h1 className="text-3xl font-bold">{props.product.name}</h1>
      </div>
      <div className="grid md:grid-cols-2 w-full gap-6 lg:gap-12 items-start max-w-6xl  mx-auto py-6">
        <div className="grid gap-4 w-full ">
          <Image
            src="https://placehold.co/400x600.png"
            alt="Product Image"
            width={600}
            height={900}
            className="aspect-[3/3] object-cover w-full rounded-lg overflow-hidden"
          />
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
        <div className="grid gap-4 md:gap-10 items-start">
          <div className="grid gap-4">
            <h1 className="font-bold text-3xl lg:text-4xl">
              {props.product.name}
            </h1>
            <div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Perspiciatis fugit sint commodi esse ducimus voluptate veniam,
                culpa vero autem deleniti ex. Commodi, maxime? Quam sit
                excepturi, ut perspiciatis consequatur aut!
              </p>
            </div>
            <div className="flex items-center  gap-2">
              <h2 className="text-primary text-xl">
                FCFA {props.product.price}
              </h2>
              <h2 className="line-through text-gray-500">
                {props.product.sale_price}
              </h2>
            </div>
          </div>
          <form className="grid gap-4 md:gap-10">
            <div className="grid gap-2">
              <Label htmlFor="color" className="text-base">
                Color
              </Label>
              <RadioGroup
                id="color"
                defaultValue="black"
                className="flex items-center gap-2">
                <Label
                  htmlFor="color-black"
                  className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted">
                  <RadioGroupItem id="color-black" value="black" />
                  Black
                </Label>
                <Label
                  htmlFor="color-white"
                  className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted">
                  <RadioGroupItem id="color-white" value="white" />
                  White
                </Label>
                <Label
                  htmlFor="color-blue"
                  className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted">
                  <RadioGroupItem id="color-blue" value="blue" />
                  Blue
                </Label>
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
                <Label
                  htmlFor="size-xs"
                  className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted">
                  <RadioGroupItem id="size-xs" value="xs" />
                  XS
                </Label>
                <Label
                  htmlFor="size-s"
                  className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted">
                  <RadioGroupItem id="size-s" value="s" />S
                </Label>
                <Label
                  htmlFor="size-m"
                  className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted">
                  <RadioGroupItem id="size-m" value="m" />M
                </Label>
                <Label
                  htmlFor="size-l"
                  className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted">
                  <RadioGroupItem id="size-l" value="l" />L
                </Label>
                <Label
                  htmlFor="size-xl"
                  className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted">
                  <RadioGroupItem id="size-xl" value="xl" />
                  XL
                </Label>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity" className="text-base">
                Quantity
              </Label>
              <Select defaultValue="1">
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="lg">Add to cart</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
