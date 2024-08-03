"use client";
import { useState } from "react";
import Image from "next/image";
import logo from "@/public/lachostore.png";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { Link, usePathname } from "../navigation";
import { useCart } from "@/providers/cart";
import AdvancedSearchModal from "../reusables/advanced-search";
import { useCurrency } from "@/providers/currency";
import { Globe, ChevronDown, DollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsche" },
  { code: "tr", name: "Turkish" },
];

const LanguageCurrencyDropdowns = ({ currentLanguage, pathname }) => {
  const { currency, changeCurrency, supportedCurrencies } = useCurrency();
  console.log(pathname);

  return (
    <div className="flex space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Globe className="mr-2 h-4 w-4" />
            {currentLanguage.name}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {languages.map((lang) => (
            <DropdownMenuItem key={lang.code}>
              <Link href={`/${pathname}`} locale={lang.code}>
                {lang.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="hidden md:flex">
            <DollarSign className="mr-2 h-4 w-4" />
            {currency}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {supportedCurrencies.map((curr) => (
            <DropdownMenuItem
              key={curr.code}
              onSelect={() => changeCurrency(curr.code)}>
              {curr.name} ({curr.code})
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default function Header({
  locale,
  home,
  shop,
  header_cart,
  apply,
  contact,
  products,
}) {
  const pathNames = [
    { name: home, path: "/" },
    { name: shop, path: "/products" },
    { name: header_cart, path: "/cart" },
    { name: apply, path: "/application" },
    { name: contact, path: "https://lachofit.com/contact" },
  ];

  const pathName = usePathname();
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];
  const { currency, changeCurrency, supportedCurrencies } = useCurrency();

  const toggleSearchModal = () => setIsSearchModalOpen(!isSearchModalOpen);

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
                  <Link
                    href={path.path}
                    locale={locale}
                    className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary
                      ${
                        path.path === pathName
                          ? "text-primary font-bold"
                          : "text-muted-foreground"
                      }`}>
                    {path.name}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearchModal}
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
            <LanguageCurrencyDropdowns
              currentLanguage={currentLanguage}
              currency={currency}
              pathname={pathName}
            />
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
                      <Button
                        variant="outline"
                        onClick={toggleSearchModal}
                        className="w-full">
                        <Search className="mr-2 h-4 w-4" /> Search Products
                      </Button>
                      <LanguageCurrencyDropdowns
                        currentLanguage={currentLanguage}
                        currency={currency}
                        pathname={pathName}
                      />
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            <AdvancedSearchModal
              products={products}
              isOpen={isSearchModalOpen}
              onClose={() => setIsSearchModalOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
