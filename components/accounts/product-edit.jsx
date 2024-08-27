"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { TrashIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { fetchData } from "../functions/fetch-data";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().min(0).optional(),
  images: z.array(z.instanceof(File)).optional(),
});

export default function EditProduct({ productId, store_id }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const fetchProductData = async () => {
      const productData = await fetchData(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/api/products/${productId}/`
      );

      setValue("name", productData.name);
      setValue("description", productData.description);
      setValue("price", productData.price);
      setValue("stock", productData.stock);

      setImages(
        productData.images.map((img, index) => ({
          preview: img.image,
          order: index + 1,
        }))
      );
    };

    fetchProductData();
  }, [productId, setValue]);

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file, index) => ({
        file,
        preview: URL.createObjectURL(file),
        order: images.length + index + 1,
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
      setValue(
        "images",
        [...images, ...newImages].map((img) => img.file)
      );
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    setValue(
      "images",
      newImages.map((img) => img.file)
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("store_id", store_id);

    formData.append(
      "product_data",
      JSON.stringify({
        name: data.name,
        price: data.price,
        description: data.description,
        stock: data.stock,
      })
    );

    // Append images
    if (data.images) {
      data.images.forEach((file) => {
        formData.append(`images`, file);
      });
    }

    try {
      const response = await fetch(
        `${baseUrl}/store/products/${productId}/edit/`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Product updated successfully!");
      } else {
        toast.error(
          `Error: ${result.message || "Product update failed or network error"}`
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors) => {
    toast.error("Please fix the errors in the form and try again.");
  };

  return (
    <div className="container mx-auto px-4 py-8 my-12">
      <Toaster />
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>
            Update the details of the product you want to edit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                {...register("name")}
                placeholder="Enter product name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription">Description</Label>
              <Textarea
                id="productDescription"
                {...register("description")}
                placeholder="Enter product description"
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <span className="text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="productPrice">Price</Label>
              <Input
                id="productPrice"
                type="number"
                {...register("price", {
                  valueAsNumber: true,
                })}
                placeholder="2500XAF"
                min="0"
                step="500"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <span className="text-red-500">{errors.price.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                {...register("stock", {
                  valueAsNumber: true,
                })}
                placeholder="Enter stock quantity"
                className={errors.stock ? "border-red-500" : ""}
              />
              {errors.stock && (
                <span className="text-red-500">{errors.stock.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="productImages">Product Images</Label>
              <Input
                id="productImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
              <div className="grid grid-cols-3 gap-4 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      width={1000}
                      height={1000}
                      src={image.preview}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-lg"
                      onClick={() => handleRemoveImage(index)}>
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating product..." : "Update product"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
