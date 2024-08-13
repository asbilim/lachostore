"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const UserDashboard = ({ userType }) => {
  const [activeTab, setActiveTab] = useState("personal-info");

  // Conditional tabs based on user type
  const tabContent = {
    "personal-info": { icon: User, component: PersonalInfoTab },
    password: { icon: Lock, component: PasswordTab },
    orders: { icon: ShoppingBag, component: OrdersTab },
    ...(userType === "store-owner" && {
      products: { icon: Package, component: ProductsTab },
      "store-info": { icon: Store, component: StoreInfoTab },
      "sales-analytics": { icon: BarChart2, component: SalesAnalyticsTab },
    }),
  };

  const ActiveComponent = tabContent[activeTab].component;

  return (
    <div className="w-full min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Dashboard</h1>
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
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}>
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

const MobileNavigation = ({ activeTab, setActiveTab, tabContent }) => (
  <ScrollArea className="h-full">
    <div className="py-4">
      <h2 className="mb-4 text-lg font-semibold">Dashboard</h2>
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

const PersonalInfoTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Personal Information</CardTitle>
      <CardDescription>
        Update your name, email, and contact information.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue="Jared Palmer" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="jared@example.com" />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" defaultValue="+1 (555) 555-5555" />
      </div>
    </CardContent>
    <CardFooter>
      <Button>Save Changes</Button>
    </CardFooter>
  </Card>
);

const PasswordTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Change Password</CardTitle>
      <CardDescription>
        Update your password to keep your account secure.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="current-password">Current Password</Label>
        <Input id="current-password" type="password" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-password">New Password</Label>
        <Input id="new-password" type="password" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input id="confirm-password" type="password" />
      </div>
    </CardContent>
    <CardFooter>
      <Button>Update Password</Button>
    </CardFooter>
  </Card>
);

const OrdersTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Orders</CardTitle>
      <CardDescription>View and manage your recent orders.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                id: "12345",
                date: "2023-04-15",
                status: "Fulfilled",
                total: 99.99,
              },
              {
                id: "12346",
                date: "2023-04-10",
                status: "Pending",
                total: 49.99,
              },
              {
                id: "12347",
                date: "2023-04-05",
                status: "Cancelled",
                total: 79.99,
              },
            ].map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "Fulfilled" ? "secondary" : "outline"
                    }>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  ${order.total.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="ml-2">
                    Return
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

const ProductsTab = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product 1",
      category: "Electronics",
      price: 99.99,
      stock: 50,
    },
    {
      id: 2,
      name: "Product 2",
      category: "Clothing",
      price: 49.99,
      stock: 100,
    },
    {
      id: 3,
      name: "Product 3",
      category: "Home & Garden",
      price: 79.99,
      stock: 25,
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Products</CardTitle>
            <CardDescription>Manage your product inventory</CardDescription>
          </div>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Enter the details of your new product below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
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
                    Category
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
                    Price
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
                    Stock
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
                <Button onClick={handleAddProduct}>Add Product</Button>
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
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="ml-2">
                      Delete
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

const StoreInfoTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Store Information</CardTitle>
      <CardDescription>
        Update your store details and social media links.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="store-name">Store Name</Label>
        <Input id="store-name" defaultValue="My Awesome Store" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="store-address">Store Address</Label>
        <Input id="store-address" defaultValue="123 Store St, Shop City" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="store-avatar">Store Avatar</Label>
        <Input id="store-avatar" type="file" accept="image/*" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="store-description">Store Description</Label>
        <Input
          id="store-description"
          defaultValue="We sell awesome products!"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="social-media-links">Social Media Links</Label>
        <Input id="social-media-facebook" placeholder="Facebook URL" />
        <Input id="social-media-instagram" placeholder="Instagram URL" />
        <Input id="social-media-twitter" placeholder="Twitter URL" />
      </div>
    </CardContent>
    <CardFooter>
      <Button>Save Changes</Button>
    </CardFooter>
  </Card>
);

const SalesAnalyticsTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Sales Analytics</CardTitle>
      <CardDescription>
        View your {"store's"} sales performance.
      </CardDescription>
    </CardHeader>
    <CardContent>
      {/* Placeholder for actual charts/graphs */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Total Revenue</h3>
          <div className="bg-gray-100 p-4 rounded-lg">[Revenue Chart]</div>
        </div>
        <div>
          <h3 className="text-lg font-medium">Top Products</h3>
          <div className="bg-gray-100 p-4 rounded-lg">[Top Products List]</div>
        </div>
        <div>
          <h3 className="text-lg font-medium">Recent Sales</h3>
          <div className="bg-gray-100 p-4 rounded-lg">[Recent Sales Table]</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default UserDashboard;
