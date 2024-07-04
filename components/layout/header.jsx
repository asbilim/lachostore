"use client";
import { useState } from "react";
import Image from "next/image";
import logo from "@/public/lachostore.png";
import { Input } from "../ui/input";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { Link } from "../navigation";
import { usePathname } from "next/navigation";
import { useCart } from "@/providers/cart";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Command, CommandInput } from "@/components/ui/command";

export default function Header({
  locale,
  home,
  shop,
  header_cart,
  apply,
  contact,
}) {
  const pathNames = [
    { name: home, path: "/" },
    { name: shop, path: locale + "/products" },
    { name: header_cart, path: locale + "/cart" },
    { name: apply, path: locale + "/application" },
    { name: contact, path: locale + "/contact" },
  ];

  const pathName = usePathname();
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header className="bg-background px-4 md:px-8 lg:px-12 py-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link locale={locale} href="/" className="flex-shrink-0">
            <Image
              src={logo}
              width={200}
              alt="lachofit logo"
              className="hidden md:block"
            />
            <Image
              src={logo}
              width={120}
              alt="lachofit logo"
              className="md:hidden"
            />
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {pathNames.map((path) => (
                <NavigationMenuItem key={path.name}>
                  <NavigationMenuLink
                    href={path.path}
                    className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary
                      ${
                        path.path === pathName
                          ? "text-primary font-bold"
                          : "text-muted-foreground"
                      }`}>
                    {path.name}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-4">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hidden md:block">
                  <Command className="rounded-lg border shadow-md">
                    <CommandInput placeholder="Search products..." />
                  </Command>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="hidden md:flex">
              <Search className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            </Button>

            <Link locale={locale} href="/cart" className="relative">
              <ShoppingBag className="w-6 h-6 text-muted-foreground" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Link>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserRound className="w-6 h-6 text-muted-foreground" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Your Account</h4>
                    <p className="text-sm">
                      Manage your profile and settings here.
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <Sheet>
              <SheetTrigger className="md:hidden">
                <Menu className="w-6 h-6 text-muted-foreground" />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    <nav className="flex flex-col space-y-4 mt-8">
                      {pathNames.map((path) => (
                        <Link
                          locale={locale}
                          key={path.name}
                          href={path.path}
                          className={`text-sm font-medium transition-colors hover:text-primary
                            ${
                              path.path === pathName
                                ? "text-primary font-bold"
                                : "text-muted-foreground"
                            }`}>
                          {path.name}
                        </Link>
                      ))}
                    </nav>
                    <div className="mt-8">
                      <Command className="rounded-lg border shadow-md">
                        <CommandInput placeholder="Search products..." />
                      </Command>
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
