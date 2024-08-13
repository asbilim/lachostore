"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, ShoppingBag, ArrowUpLeft, Menu, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { useSession } from "next-auth/react";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("personal-info");
  const { data: session } = useSession();
  console.log(session);
  const tabContent = {
    "personal-info": { icon: User, component: PersonalInfoTab },
    password: { icon: Lock, component: PasswordTab },
    orders: { icon: ShoppingBag, component: OrdersTab },
    returns: { icon: ArrowUpLeft, component: ReturnsTab },
  };

  return (
    <div className="w-full min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Welcome , {session?.user?.username}
          </h1>
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
                {React.createElement(tabContent[activeTab].component)}
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

const ReturnsTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Returns</CardTitle>
      <CardDescription>Manage your return requests.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { id: "12345", date: "2023-04-15", status: "Approved" },
              { id: "12346", date: "2023-04-10", status: "Pending" },
              { id: "12347", date: "2023-04-05", status: "Declined" },
            ].map((return_) => (
              <TableRow key={return_.id}>
                <TableCell className="font-medium">#{return_.id}</TableCell>
                <TableCell>{return_.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      return_.status === "Approved" ? "secondary" : "outline"
                    }>
                    {return_.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    Track
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

export default UserDashboard;
