"use client";
import { OrdersTab } from "./store";
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
  Loader,
  Download,
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from "next/image";
import * as z from "zod";
import { fetchData } from "../functions/fetch-data";
import { ProductsTab } from "./products";
import { AlertCircle, Loader2, DownloadCloud } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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

export const productSchema = z.object({
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

// Dashboard Component
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
        `${baseUrl}/store/api/specification-keys/`,
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
              className="mt-4"
              placeholder="Select a store">
              <SelectTrigger>
                <SelectValue placeholder="Select a store" />
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

  // Tab configuration based on user type
  const tabContent = {
    "personal-info": { icon: User, component: PersonalInfoTab },
    password: { icon: Lock, component: PasswordTab },
    orders: { icon: ShoppingBag, component: OrdersTab },
    products: { icon: Package, component: ProductsTab },
    "store-info": { icon: Store, component: StoreInfoTab },
    "sales-analytics": { icon: BarChart2, component: SalesAnalyticsTab },
  };

  // Retrieve the active component based on the active tab
  const ActiveComponent = tabContent[activeTab].component;

  return (
    <div className="w-full min-h-screen mt-12  p-4 sm:p-6 lg:p-8">
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
                <SelectValue placeholder={"Select a store"} />
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

// Mobile Navigation Component
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

// Products Tab Component

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

// Personal Information Tab Component
const PersonalInfoTab = ({ texts }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        setUsername(session?.username || "");
        setEmail(session?.user?.email || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setShowErrorAlert(false);

    try {
      schema.parse({ username, email });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/update-account/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ username, email }),
        }
      );

      if (response.ok) {
        setShowSuccessDialog(true);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.username
            ? errorData.username
            : errorData.email || "Failed to update profile"
        );
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || "An unexpected error occurred");
      }
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{texts.dashboard.personalInfo.title}</CardTitle>
          <CardDescription>
            {texts.dashboard.personalInfo.description}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="username">
                  {texts.dashboard.personalInfo.labels.name}
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">
                  {texts.dashboard.personalInfo.labels.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            {error && (
              <div className="text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {"submitting datas"}
                </>
              ) : (
                "change your infos"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Info changed successfully"}</AlertDialogTitle>
            <AlertDialogDescription>
              {"Your info was changed successfully"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>{"Ok"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showErrorAlert && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{"An error occurred"}</AlertTitle>
          <AlertDescription>
            {"We could not change your information , please try again later"}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
// Password Tab Component
const PasswordTab = ({ texts }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const { data: session } = useSession();
  console.log(session?.accessToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setShowErrorAlert(false);

    try {
      passwordSchema.parse({ currentPassword, newPassword, confirmPassword });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/change-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({
            old_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      if (response.ok) {
        setShowSuccessDialog(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || "An unexpected error occurred");
      }
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{texts.dashboard.password.title}</CardTitle>
          <CardDescription>
            {texts.dashboard.password.description}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="current-password">
                {texts.dashboard.password.labels.currentPassword}
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new-password">
                {texts.dashboard.password.labels.newPassword}
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm-password">
                {texts.dashboard.password.labels.confirmPassword}
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {texts.dashboard.password.loadingText}
                </>
              ) : (
                texts.dashboard.password.buttonText
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Password changed</AlertDialogTitle>
            <AlertDialogDescription>
              The operation was success, your password has been changed
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Password changed successfully</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showErrorAlert && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{"Something went wrong"}</AlertTitle>
          <AlertDescription>
            {"There was an error when trying to change your password"}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

// Store Information Tab Component
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

// Sales Analytics Tab Component
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
