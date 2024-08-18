"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Badge } from "@/components/ui/badge";
import { PlusIcon, TrashIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Select from "react-select";
import { fetchData } from "../functions/fetch-data";
import toast, { Toaster } from "react-hot-toast";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  brand: z
    .object({ value: z.string(), label: z.string(), id: z.number() }) // Expecting numeric ID
    .required("Brand is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be a positive number"),
  discount: z.number().min(0).optional(),
  weight: z.number().positive("Weight must be a positive number"),
  category: z
    .object({ value: z.string(), label: z.string(), id: z.number() }) // Expecting numeric ID
    .required("Category is required"),
  colors: z
    .array(z.object({ value: z.string(), label: z.string(), id: z.number() })) // value as string, id as number
    .optional(),
  sizes: z
    .array(z.object({ value: z.string(), label: z.string(), id: z.number() })) // value as string, id as number
    .optional(),
  specifications: z
    .array(
      z.object({
        key: z.string().min(1, "Specification key is required"),
        value: z.string().min(1, "Specification value is required"),
      })
    )
    .optional(),
  images: z.array(z.instanceof(File)).optional(),
  keywords: z.array(z.string()).optional(),
});

export default function AddProduct({ store_id }) {
  const [images, setImages] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [specificationsKey, setSpecificationsKey] = useState([]);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchDataSets = async () => {
      const colorsData = await fetchData(`${baseUrl}/store/api/colors/`, [
        "colors",
      ]);
      const brandsData = await fetchData(`${baseUrl}/store/api/brands/`, [
        "brands",
      ]);
      const categoriesData = await fetchData(
        `${baseUrl}/store/api/categories/`,
        ["categories"]
      );
      const sizesData = await fetchData(`${baseUrl}/store/api/sizes/`, [
        "sizes",
      ]);
      const specificationsKeyData = await fetchData(
        `${baseUrl}/store/api/specification-keys/`,
        ["specifications"]
      );

      const formattedColors = colorsData.map((color) => ({
        id: color.id,
        label: color.name,
        value: color.name,
      }));
      const formattedBrands = brandsData.map((brand) => ({
        value: brand.name,
        label: brand.name,
        id: brand.id,
      }));
      const formattedCategories = categoriesData.map((category) => ({
        value: category.name,
        label: category.name,
        id: category.id,
      }));
      const formattedSizes = sizesData.map((size) => ({
        id: size.id,
        label: size.name,
        value: size.name,
      }));
      const formattedSpecificationKeys = specificationsKeyData.map((spec) => ({
        value: spec.name,
        label: spec.name,
        id: spec.name,
      }));

      setColors(formattedColors);
      setBrands(formattedBrands);
      setCategories(formattedCategories);
      setSizes(formattedSizes);
      setSpecificationsKey(formattedSpecificationKeys);
    };

    fetchDataSets();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file, index) => ({
        file,
        preview: URL.createObjectURL(file),
        order: index + 1,
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
      setValue(
        "images",
        [...images, ...newImages].map((img) => img.file)
      );
    }
  };

  const handleAddSpecification = () => {
    setSpecifications((prevSpecs) => [...prevSpecs, { key: "", value: "" }]);
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = specifications.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec
    );
    setSpecifications(newSpecs);
    setValue("specifications", newSpecs);
  };

  const handleAddKeyword = (event) => {
    if (event.key === "Enter" && currentKeyword.trim() !== "") {
      event.preventDefault();
      const newKeywords = [...keywords, currentKeyword.trim()];
      setKeywords(newKeywords);
      setValue("keywords", newKeywords);
      setCurrentKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    const newKeywords = keywords.filter(
      (keyword) => keyword !== keywordToRemove
    );
    setKeywords(newKeywords);
    setValue("keywords", newKeywords);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("store_id", store_id);

    Object.keys(data).forEach((key) => {
      if (key === "images") {
        data.images.forEach((file, index) =>
          formData.append(`images[${index}]`, file)
        );
      } else if (key === "category" || key === "brand") {
        formData.append(key, data[key].id); // Send the ID, which is now expected to be a number
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item, index) => {
          if (typeof item === "object" && item.id) {
            formData.append(`${key}[]`, item.id); // Send the ID, which is now expected to be a number
          } else if (typeof item === "object" && key === "specifications") {
            formData.append(`specifications[${index}][key]`, item.key);
            formData.append(`specifications[${index}][value]`, item.value);
          } else {
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      console.log(session);
      const response = await fetch(`${baseUrl}/store/products/create/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        console.log(result);
        toast.success("Product created successfully!");
      } else {
        toast.error(`Error: ${result.message || "Something went wrong"}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const onError = (errors) => {
    console.log(errors);
    toast.error("Please fix the errors in the form and try again.");
  };

  return (
    <div className="container mx-auto px-4 py-8 my-12">
      <Toaster />
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>
            Fill in the details of the new product you want to add to your
            store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="productBrand">Brand</Label>
                <Controller
                  control={control}
                  name="brand"
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={brands}
                      placeholder="Select a brand"
                      getOptionValue={(option) => option.id} // Get the ID for submission
                      className={errors.brand ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.brand && (
                  <span className="text-red-500">{errors.brand.message}</span>
                )}
              </div>
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

            <div className="grid grid-cols-3 gap-4">
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
                <Label htmlFor="productDiscount">Discount</Label>
                <Input
                  id="productDiscount"
                  type="number"
                  {...register("discount", {
                    valueAsNumber: true,
                  })}
                  placeholder="50XAF"
                  min="0"
                  className={errors.discount ? "border-red-500" : ""}
                />
                {errors.discount && (
                  <span className="text-red-500">
                    {errors.discount.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="productWeight">Weight</Label>
                <Input
                  id="productWeight"
                  type="number"
                  {...register("weight", {
                    valueAsNumber: true,
                  })}
                  placeholder="222"
                  min="0"
                  step="0.01"
                  className={errors.weight ? "border-red-500" : ""}
                />
                {errors.weight && (
                  <span className="text-red-500">{errors.weight.message}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productCategory">Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={categories}
                    placeholder="Select a category"
                    getOptionValue={(option) => option.id} // Get the ID for submission
                    className={errors.category ? "border-red-500" : ""}
                  />
                )}
              />
              {errors.category && (
                <span className="text-red-500">{errors.category.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Colors</Label>
              <Controller
                control={control}
                name="colors"
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={colors}
                    placeholder="Select colors"
                    getOptionValue={(option) => option.id} // Get the ID for submission
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Sizes</Label>
              <Controller
                control={control}
                name="sizes"
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={sizes}
                    placeholder="Select sizes"
                    getOptionValue={(option) => option.id} // Get the ID for submission
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Specifications</Label>
              {specifications.map((spec, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Select
                    options={specificationsKey}
                    placeholder="Select specification key"
                    value={specificationsKey.find(
                      (opt) => opt.value === spec.key
                    )}
                    onChange={(e) =>
                      handleSpecificationChange(index, "key", e.value)
                    }
                    className={errors.specifications ? "border-red-500" : ""}
                  />
                  <Input
                    value={spec.value}
                    onChange={(e) =>
                      handleSpecificationChange(index, "value", e.target.value)
                    }
                    placeholder="Specification value"
                    className={errors.specifications ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setSpecifications((prevSpecs) =>
                        prevSpecs.filter((_, i) => i !== index)
                      )
                    }>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSpecification}>
                <PlusIcon className="h-4 w-4 mr-2" /> Add Specification
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productKeywords">Keywords</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-sm py-1 px-2">
                    {keyword}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemoveKeyword(keyword)}>
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Input
                id="productKeywords"
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                onKeyDown={handleAddKeyword}
                placeholder="Type a keyword and press Enter"
              />
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
                  <Image
                    width={1000}
                    height={1000}
                    key={index}
                    src={image.preview}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>

            <CardFooter>
              <Button type="submit" className="w-full">
                Add Product
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
