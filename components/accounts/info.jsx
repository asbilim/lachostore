"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  User,
  Lock,
  ShoppingBag,
  Package,
  BarChart2,
  Store,
  Menu,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader,
  Loader2,
  Minus,
  X,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";
import { useCurrency } from "@/providers/currency";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchData } from "../functions/fetch-data";
import { useDropzone } from "react-dropzone";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { useToast } from "../ui/use-toast";
import { FixedSizeList as List } from "react-window";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const productSchema = z.object({
  name: z.string().nonempty({ message: "Product name is required" }),
  category: z.string().nonempty({ message: "Category is required" }),
  brand: z.string().nonempty({ message: "Brand is required" }),
  price: z.string().nonempty({ message: "Price is required" }),
  stock: z.string().nonempty({ message: "Stock quantity is required" }),
  colors: z
    .array(z.string())
    .nonempty({ message: "At least one color is required" }),
  sizes: z
    .array(z.string())
    .nonempty({ message: "At least one size is required" }),
  specifications: z
    .array(
      z.object({
        key: z.string().nonempty(),
        value: z.string().nonempty(),
      })
    )
    .nonempty({ message: "At least one specification is required" }),
  features: z
    .array(z.string())
    .nonempty({ message: "At least one feature is required" }),
  images: z
    .array(z.any())
    .nonempty({ message: "At least one image is required" }),
});

const fetchStore = async (slug, accessToken) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/details/${slug}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return await response.json();
};

const UserDashboard = ({ texts }) => {
  const { data: session } = useSession();
  const isOwner = session?.is_owner;
  const shops = session?.shops || [];
  const [selectedShopId, setSelectedShopId] = useState(shops[0]?.id || null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal-info");

  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [specificationsKey, setSpecificationsKey] = useState([]);

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
      const featuresData = await fetchData(`${baseUrl}/store/api/features/`, [
        "features",
      ]);
      const sizesData = await fetchData(`${baseUrl}/store/api/sizes/`, [
        "sizes",
      ]);
      const specificationsKeyData = await fetchData(
        `${baseUrl}/store/api/specifications-keys/`,
        ["specifications"]
      );

      setColors(colorsData);
      setBrands(brandsData);
      setCategories(categoriesData);
      setFeatures(featuresData);
      setSizes(sizesData);
      setSpecificationsKey(specificationsKeyData);
    };

    fetchDataSets();
  }, []);

  useEffect(() => {
    const loadShopData = async () => {
      if (selectedShopId) {
        setLoading(true);
        const shop = shops.find((shop) => shop.id === selectedShopId);
        if (shop) {
          const fetchedShop = await fetchStore(shop.slug, session?.accessToken);
          setSelectedShop(fetchedShop);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    loadShopData();
  }, [selectedShopId, shops, session?.accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  if (!isOwner || shops.length === 0) {
    return (
      <div className="w-full my-16 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">
            {texts.noStoreAvailable.title}
          </h1>
          <p className="text-lg mb-4">{texts.noStoreAvailable.description}</p>
        </div>
      </div>
    );
  }

  if (!selectedShop || !selectedShop.is_active) {
    return (
      <div className="w-full my-16 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              {texts.storeNotActive.title}
            </h1>
            <p className="text-lg mb-4">
              {texts.storeNotActive.description}{" "}
              <a
                href="mailto:info@lachofit.com"
                className="text-blue-500 underline">
                info@lachofit.com
              </a>{" "}
              to activate your store.
            </p>
            <Select
              value={selectedShopId}
              onValueChange={setSelectedShopId}
              className="mt-4">
              <SelectTrigger>
                <SelectValue
                  placeholder={texts.storeNotActive.selectPlaceholder}
                />
              </SelectTrigger>
              <SelectContent>
                {shops.map((shop) => (
                  <SelectItem key={shop.id} value={shop.id}>
                    {shop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  const tabContent = {
    "personal-info": { icon: User, component: PersonalInfoTab },
    password: { icon: Lock, component: PasswordTab },
    orders: { icon: ShoppingBag, component: OrdersTab },
    products: { icon: Package, component: ProductsTab },
    "store-info": { icon: Store, component: StoreInfoTab },
    "sales-analytics": { icon: BarChart2, component: SalesAnalyticsTab },
  };

  const ActiveComponent = tabContent[activeTab].component;

  return (
    <div className="w-full min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {texts.welcome}
            {session?.username}
          </h1>
          {isOwner && (
            <Select
              value={selectedShopId}
              onValueChange={setSelectedShopId}
              className="ml-auto">
              <SelectTrigger>
                <SelectValue
                  placeholder={texts.storeNotActive.selectPlaceholder}
                />
              </SelectTrigger>
              <SelectContent>
                {shops.map((shop) => (
                  <SelectItem key={shop.id} value={shop.id}>
                    {shop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <MobileNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabContent={tabContent}
                texts={texts}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <Card>
              <CardContent className="p-4">
                <Tabs
                  defaultValue={activeTab}
                  orientation="vertical"
                  onValueChange={setActiveTab}
                  className="w-full">
                  <TabsList className="flex flex-col h-full space-y-2">
                    {Object.entries(tabContent).map(([key, { icon: Icon }]) => (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="w-full justify-start">
                        <Icon className="mr-2 h-4 w-4" />
                        {key.replace("-", " ").charAt(0).toUpperCase() +
                          key.slice(1).replace("-", " ")}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </aside>

          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedShopId}-${activeTab}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}>
                <ActiveComponent
                  shop={selectedShop}
                  texts={texts}
                  colors={colors}
                  brands={brands}
                  categories={categories}
                  features={features}
                  sizes={sizes}
                  specificationsKey={specificationsKey}
                />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

const MobileNavigation = ({ activeTab, setActiveTab, tabContent, texts }) => (
  <ScrollArea className="h-full">
    <div className="py-4">
      <h2 className="mb-4 text-lg font-semibold">{texts.dashboard.title}</h2>
      <nav className="space-y-2">
        {Object.entries(tabContent).map(([key, { icon: Icon }]) => (
          <Button
            key={key}
            variant={activeTab === key ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab(key)}>
            <Icon className="mr-2 h-4 w-4" />
            {key.replace("-", " ").charAt(0).toUpperCase() +
              key.slice(1).replace("-", " ")}
          </Button>
        ))}
      </nav>
    </div>
  </ScrollArea>
);

const ProductsTab = ({
  shop,
  texts,
  colors,
  brands,
  categories,
  features,
  sizes,
  specificationsKey,
}) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      specifications: [{ key: "", value: "" }],
    },
  });

  const {
    fields: specificationFields,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name: "specifications",
  });

  const { currency, convertCurrency } = useCurrency();

  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
    // Handle file upload logic here
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const handleAddProduct = async (data) => {
    setIsLoading(true);
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts([...products, { ...data, id: products.length + 1 }]);
      reset();
      setIsAddProductOpen(false);
      toast({
        title: "Product added successfully",
        description: `${data.name} has been added to your products.`,
      });
    } catch (error) {
      toast({
        title: "Error adding product",
        description: "There was an error adding the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shop?.products) {
      setProducts(shop.products);
    }
  }, [shop]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(products.length / itemsPerPage);

  const MultiSelectWithChips = ({ name, options, label, placeholder }) => {
    const selectedValues = watch(name) || [];

    const Row = ({ index, style }) => (
      <div style={style}>
        <SelectItem value={options[index].name}>
          {options[index].name}
        </SelectItem>
      </div>
    );

    return (
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={name} className="text-right">
          {label}
        </Label>
        <div className="col-span-3">
          <Select id={name} {...register(name)} multiple>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <List
                height={150}
                itemCount={options.length}
                itemSize={10}
                width="100%">
                {Row}
              </List>
            </SelectContent>
          </Select>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedValues.map((value) => (
              <Badge key={value} variant="secondary">
                {value}
                <button
                  type="button"
                  onClick={() => {
                    const newValues = selectedValues.filter((v) => v !== value);
                    register(name).onChange(newValues);
                  }}
                  className="ml-1 text-xs">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        {errors[name] && (
          <p className="text-red-500 text-sm col-span-4">
            {errors[name].message}
          </p>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{texts.dashboard.products.title}</CardTitle>
            <CardDescription>
              {texts.dashboard.products.description}
            </CardDescription>
          </div>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {texts.dashboard.products.addProductButton}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {texts.dashboard.products.addProductDialog.title}
                </DialogTitle>
                <DialogDescription>
                  {texts.dashboard.products.addProductDialog.description}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px]">
                <form onSubmit={handleSubmit(handleAddProduct)}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        {texts.dashboard.products.addProductDialog.labels.name}
                      </Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className="col-span-3"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm col-span-4">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        {
                          texts.dashboard.products.addProductDialog.labels
                            .category
                        }
                      </Label>
                      <Select
                        id="category"
                        {...register("category")}
                        className="col-span-3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-red-500 text-sm col-span-4">
                          {errors.category.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="brand" className="text-right">
                        {texts.dashboard.products.addProductDialog.labels.brand}
                      </Label>
                      <Select
                        id="brand"
                        {...register("brand")}
                        className="col-span-3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.name}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.brand && (
                        <p className="text-red-500 text-sm col-span-4">
                          {errors.brand.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        {texts.dashboard.products.addProductDialog.labels.price}
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        {...register("price")}
                        className="col-span-3"
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm col-span-4">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="stock" className="text-right">
                        {texts.dashboard.products.addProductDialog.labels.stock}
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        {...register("stock")}
                        className="col-span-3"
                      />
                      {errors.stock && (
                        <p className="text-red-500 text-sm col-span-4">
                          {errors.stock.message}
                        </p>
                      )}
                    </div>
                    <MultiSelectWithChips
                      name="colors"
                      options={colors}
                      label={
                        texts.dashboard.products.addProductDialog.labels.colors
                      }
                      placeholder="Select colors"
                    />
                    <MultiSelectWithChips
                      name="sizes"
                      options={sizes}
                      label={
                        texts.dashboard.products.addProductDialog.labels.sizes
                      }
                      placeholder="Select sizes"
                    />
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label
                        htmlFor="specifications"
                        className="text-right mt-2">
                        {
                          texts.dashboard.products.addProductDialog.labels
                            .specifications
                        }
                      </Label>
                      <div className="col-span-3 space-y-2">
                        {specificationFields.map((field, index) => (
                          <div key={field.id} className="flex space-x-2">
                            <Select
                              {...register(`specifications.${index}.key`)}
                              className="w-1/2">
                              <SelectTrigger>
                                <SelectValue placeholder="Select a key" />
                              </SelectTrigger>
                              <SelectContent>
                                {specificationsKey?.map((spec) => (
                                  <SelectItem key={spec.id} value={spec.name}>
                                    {spec.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              {...register(`specifications.${index}.value`)}
                              placeholder="Enter value"
                              className="w-1/2"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeSpecification(index)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            appendSpecification({ key: "", value: "" })
                          }>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Specification
                        </Button>
                      </div>
                      {errors.specifications && (
                        <p className="text-red-500 text-sm col-span-4">
                          {errors.specifications.message}
                        </p>
                      )}
                    </div>
                    <MultiSelectWithChips
                      name="features"
                      options={features}
                      label={
                        texts.dashboard.products.addProductDialog.labels
                          .features
                      }
                      placeholder="Select features"
                    />
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="images" className="text-right">
                        {
                          texts.dashboard.products.addProductDialog.labels
                            .images
                        }
                      </Label>
                      <div
                        {...getRootProps({
                          className:
                            "dropzone col-span-3 border-2 border-dashed rounded-md p-4 text-center cursor-pointer",
                        })}>
                        <input {...getInputProps()} />
                        <p>
                          Drag {"'n'"} drop some files here, or click to select
                          files
                        </p>
                      </div>
                      {errors.images && (
                        <p className="text-red-500 text-sm col-span-4">
                          {errors.images.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Please wait
                        </>
                      ) : (
                        texts.dashboard.products.addProductDialog.buttonText
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {texts.dashboard.products.tableHeaders.name}
                </TableHead>
                <TableHead>
                  {texts.dashboard.products.tableHeaders.category}
                </TableHead>
                <TableHead>
                  {texts.dashboard.products.tableHeaders.price}
                </TableHead>
                <TableHead>
                  {texts.dashboard.products.tableHeaders.stock}
                </TableHead>
                <TableHead className="text-right">
                  {texts.dashboard.products.tableHeaders.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {currentItems.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {currency}{" "}
                      {parseFloat(
                        convertCurrency(product.price, "XAF", currency)
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="mr-2">
                        {texts.dashboard.products.actions.edit}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500">
                        {texts.dashboard.products.actions.delete}
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div>
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, products.length)} of {products.length}{" "}
          entries
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(pageCount)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, pageCount))
                }
                disabled={currentPage === pageCount}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
};

const PersonalInfoTab = ({ texts }) => (
  <Card>
    <CardHeader>
      <CardTitle>{texts.dashboard.personalInfo.title}</CardTitle>
      <CardDescription>
        {texts.dashboard.personalInfo.description}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="name">
            {texts.dashboard.personalInfo.labels.name}
          </Label>
          <Input id="name" defaultValue="Jared Palmer" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">
            {texts.dashboard.personalInfo.labels.email}
          </Label>
          <Input id="email" type="email" defaultValue="jared@example.com" />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="phone">
          {texts.dashboard.personalInfo.labels.phone}
        </Label>
        <Input id="phone" type="tel" defaultValue="+1 (555) 555-5555" />
      </div>
    </CardContent>
    <CardFooter>
      <Button>{texts.dashboard.personalInfo.buttonText}</Button>
    </CardFooter>
  </Card>
);

const PasswordTab = ({ texts }) => (
  <Card>
    <CardHeader>
      <CardTitle>{texts.dashboard.password.title}</CardTitle>
      <CardDescription>{texts.dashboard.password.description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="current-password">
          {texts.dashboard.password.labels.currentPassword}
        </Label>
        <Input id="current-password" type="password" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-password">
          {texts.dashboard.password.labels.newPassword}
        </Label>
        <Input id="new-password" type="password" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="confirm-password">
          {texts.dashboard.password.labels.confirmPassword}
        </Label>
        <Input id="confirm-password" type="password" />
      </div>
    </CardContent>
    <CardFooter>
      <Button>{texts.dashboard.password.buttonText}</Button>
    </CardFooter>
  </Card>
);

const OrdersTab = ({ texts }) => (
  <Card>
    <CardHeader>
      <CardTitle>{texts.dashboard.orders.title}</CardTitle>
      <CardDescription>{texts.dashboard.orders.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {texts.dashboard.orders.tableHeaders.orderNumber}
              </TableHead>
              <TableHead>{texts.dashboard.orders.tableHeaders.date}</TableHead>
              <TableHead>
                {texts.dashboard.orders.tableHeaders.status}
              </TableHead>
              <TableHead className="text-right">
                {texts.dashboard.orders.tableHeaders.total}
              </TableHead>
              <TableHead className="text-right">
                {texts.dashboard.orders.tableHeaders.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                id: "12345",
                date: "2023-04-15",
                status: texts.dashboard.orders.status.fulfilled,
                total: 99.99,
              },
              {
                id: "12346",
                date: "2023-04-10",
                status: texts.dashboard.orders.status.pending,
                total: 49.99,
              },
              {
                id: "12347",
                date: "2023-04-05",
                status: texts.dashboard.orders.status.cancelled,
                total: 79.99,
              },
            ].map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === texts.dashboard.orders.status.fulfilled
                        ? "secondary"
                        : "outline"
                    }>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  ${order.total.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    {texts.dashboard.orders.actions.view}
                  </Button>
                  <Button size="sm" variant="outline" className="ml-2">
                    {texts.dashboard.orders.actions.return}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

const StoreInfoTab = ({ shop, texts }) => {
  const [avatar, setAvatar] = useState(shop.avatar);

  useEffect(() => {
    // Load additional store information if needed
    console.log(`Loaded store info for shop ID: ${shop.id}`);
  }, [shop]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result); // Update avatar state with the base64 encoded image
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{texts.dashboard.storeInfo.title}</CardTitle>
        <CardDescription>
          {texts.dashboard.storeInfo.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="store-name">
            {texts.dashboard.storeInfo.labels.storeName}
          </Label>
          <Input id="store-name" defaultValue={shop.name} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="store-address">
            {texts.dashboard.storeInfo.labels.storeAddress}
          </Label>
          <Input id="store-address" defaultValue={shop.address} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="store-avatar">
            {texts.dashboard.storeInfo.labels.storeAvatar}
          </Label>
          <Input
            id="store-avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          {avatar && (
            <Image
              src={avatar}
              alt="Store Avatar Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
              width={1000}
              height={1000}
            />
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="store-description">
            {texts.dashboard.storeInfo.labels.storeDescription}
          </Label>
          <Input
            id="store-description"
            defaultValue={shop.description || "No description provided"}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="social-media-links">
            {texts.dashboard.storeInfo.labels.socialMediaLinks}
          </Label>
          <Input
            id="social-media-facebook"
            placeholder="Facebook URL"
            defaultValue={shop.social_media_links?.facebook}
          />
          <Input
            id="social-media-instagram"
            placeholder="Instagram URL"
            defaultValue={shop.social_media_links?.instagram}
          />
          <Input
            id="social-media-twitter"
            placeholder="Twitter URL"
            defaultValue={shop.social_media_links?.twitter}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button>{texts.dashboard.storeInfo.buttonText}</Button>
      </CardFooter>
    </Card>
  );
};

const SalesAnalyticsTab = ({ shop, texts }) => {
  useEffect(() => {
    // Load sales analytics for the selected shop
    console.log(`Fetching sales analytics for shop ID: ${shop.id}`);
  }, [shop]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{texts.dashboard.salesAnalytics.title}</CardTitle>
        <CardDescription>
          {texts.dashboard.salesAnalytics.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Placeholder for actual charts/graphs */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Total Revenue</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              {texts.dashboard.salesAnalytics.placeholders.revenueChart}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium">Top Products</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              {texts.dashboard.salesAnalytics.placeholders.topProductsList}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium">Recent Sales</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              {texts.dashboard.salesAnalytics.placeholders.recentSalesTable}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDashboard;
