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
  Plus,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PersonalInfoTab } from "./personal-info";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import * as z from "zod";
import { fetchData } from "../functions/fetch-data";
import { ProductsTab } from "./products";
import { SalesAnalyticsTab } from "./analytics";
import { Link } from "../navigation";
import { StoreInfoTab } from "./store-update";
import { PasswordTab } from "./password";

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

// Dashboard Component
const UserDashboard = ({ texts }) => {
  const { data: session, status } = useSession();
  const [selectedShopId, setSelectedShopId] = useState(null);
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
    if (status === "authenticated" && session) {
      const isOwner = session.is_owner;
      const shops = session.shops || [];

      if (isOwner) {
        setSelectedShopId(shops[0]?.id || null);
      }

      setLoading(false);
    } else if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status, session]);

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
        const shop = session?.shops.find((shop) => shop.id === selectedShopId);
        if (shop) {
          const fetchedShop = await fetchStore(shop.slug, session?.accessToken);
          setSelectedShop(fetchedShop);
        }
        setLoading(false);
      }
    };

    if (selectedShopId && session?.shops) {
      loadShopData();
    }
  }, [selectedShopId, session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  const isOwner = session?.is_owner;
  const shops = session?.shops || [];

  // Tab configuration based on user type
  const tabContent = {
    "personal-info": { icon: User, component: PersonalInfoTab },
    password: { icon: Lock, component: PasswordTab },
  };

  if (isOwner) {
    Object.assign(tabContent, {
      orders: { icon: ShoppingBag, component: OrdersTab },
      products: { icon: Package, component: ProductsTab },
      "store-info": { icon: Store, component: StoreInfoTab },
      "sales-analytics": { icon: BarChart2, component: SalesAnalyticsTab },
    });
  }

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

        {!isOwner && (
          <div className="my-4 p-4 bg-yellow-100 text-yellow-800 rounded">
            <h2 className="text-lg font-bold">
              {texts.noStoreAvailable.title}
            </h2>
            <p>{texts.noStoreAvailable.description}</p>
          </div>
        )}

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

export default UserDashboard;
