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
  const { data: session } = useSession();
  const isOwner = session?.is_owner;
  const shops = session?.shops || [];
  const [selectedShopId, setSelectedShopId] = useState(shops[0]?.id || null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal-info");

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

  // Tab configuration based on user type
  const tabContent = {
    "personal-info": { icon: User, component: PersonalInfoTab },
    password: { icon: Lock, component: PasswordTab },
    orders: { icon: ShoppingBag, component: OrdersTab },
  };

  // Add shop owner tabs if the user is an owner
  if (isOwner) {
    Object.assign(tabContent, {
      products: { icon: Package, component: ProductsTab },
      "store-info": { icon: Store, component: StoreInfoTab },
      "sales-analytics": { icon: BarChart2, component: SalesAnalyticsTab },
    });
  }

  // Retrieve the active component based on the active tab
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
                <ActiveComponent shop={selectedShop} texts={texts} />
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

// Personal Information Tab Component
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

// Password Tab Component
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

// Orders Tab Component
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

// Products Tab Component
const ProductsTab = ({ shop, texts }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    // Load the products for the selected shop
    if (shop?.products) {
      setProducts(shop.products);
    }
  }, [shop]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleAddProduct = () => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    setNewProduct({ name: "", category: "", price: "", stock: "" });
    setIsAddProductOpen(false);
  };

  const { currency, convertCurrency } = useCurrency();

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
                <Plus className="mr-2 h-4 w-4" />{" "}
                {texts.dashboard.products.addProductButton}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {texts.dashboard.products.addProductDialog.title}
                </DialogTitle>
                <DialogDescription>
                  {texts.dashboard.products.addProductDialog.description}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    {texts.dashboard.products.addProductDialog.labels.name}
                  </Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    {texts.dashboard.products.addProductDialog.labels.category}
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setNewProduct({ ...newProduct, category: value })
                    }>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Home & Garden">
                        Home & Garden
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    {texts.dashboard.products.addProductDialog.labels.price}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    {texts.dashboard.products.addProductDialog.labels.stock}
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddProduct}>
                  {texts.dashboard.products.addProductDialog.buttonText}
                </Button>
              </DialogFooter>
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
              {currentItems.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {currency + " "}
                    {parseFloat(
                      convertCurrency(product.price, "XAF", currency)
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      {texts.dashboard.products.actions.edit}
                    </Button>
                    <Button size="sm" variant="outline" className="ml-2">
                      {texts.dashboard.products.actions.delete}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center mt-4">
          <nav className="inline-flex">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {pageNumbers.map((number) => (
              <Button
                key={number}
                variant={currentPage === number ? "primary" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(number)}
                className="mx-1">
                {number}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageNumbers.length))
              }
              disabled={currentPage === pageNumbers.length}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </CardContent>
    </Card>
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
