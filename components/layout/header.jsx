"use client";
import { useState } from "react";
import Image from "next/image";
import logo from "@/public/lachostore.png";
import {
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  LogOut,
  Settings,
} from "lucide-react";
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
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { useSession, signOut } from "next-auth/react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsche" },
  { code: "tr", name: "Turkish" },
];

const LanguageCurrencyDropdowns = ({ currentLanguage, pathname }) => {
  const { currency, changeCurrency, supportedCurrencies } = useCurrency();
  return (
    <div className="flex flex-col space-y-2 w-full md:flex-row md:space-x-2 md:space-y-0 md:w-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full md:w-auto justify-between">
            <div className="flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              <span className="mr-1">{currentLanguage.name}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {languages.map((lang) => (
            <DropdownMenuItem key={lang.code}>
              <Link href={`/${pathname}`} locale={lang.code} className="w-full">
                {lang.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full md:w-auto justify-between">
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              <span className="mr-1">{currency}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {supportedCurrencies.map((curr) => (
            <DropdownMenuItem
              key={curr.code}
              onSelect={() => changeCurrency(curr.code)}
              className="w-full">
              {curr.name} ({curr.code})
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const UserMenu = ({ session }) => {
  const handleLogout = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/logout/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + session?.accessToken,
        },
        body: JSON.stringify({
          refresh_token: session?.refreshToken,
        }),
      }
    );
    signOut();
  };

  if (!session) {
    return (
      <Link href="/auth/login">
        <Button variant="ghost" size="sm">
          Login
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback>{session.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">Welcome, {session.username}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/accounts" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
  const { data: session } = useSession();

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

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
              unoptimized
            />
            <Image
              src={logo}
              width={120}
              alt="lachofit logo"
              className="md:hidden"
              unoptimized
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

            <UserMenu session={session} />

            <div className="hidden md:block">
              <LanguageCurrencyDropdowns
                currentLanguage={currentLanguage}
                pathname={pathName}
              />
            </div>

            <Sheet>
              <SheetTrigger className="md:hidden">
                <Menu className="w-6 h-6 text-muted-foreground" />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    {session && (
                      <div className="flex items-center space-x-2 mb-4">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {session.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          Welcome, {session.username}
                        </span>
                      </div>
                    )}
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
                      {session ? (
                        <>
                          <Link
                            href="/accounts"
                            className="text-sm font-medium flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            Account
                          </Link>
                          <Button
                            onClick={() => signOut()}
                            variant="ghost"
                            className="justify-start text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                          </Button>
                        </>
                      ) : (
                        <Link
                          href="/auth/login"
                          className="text-sm font-medium">
                          Login
                        </Link>
                      )}
                    </nav>
                    <div className="mt-8">
                      <Button
                        variant="outline"
                        onClick={toggleSearchModal}
                        className="w-full">
                        <Search className="mr-2 h-4 w-4" /> Search Products
                      </Button>
                    </div>
                    <div className="mt-4">
                      <LanguageCurrencyDropdowns
                        currentLanguage={currentLanguage}
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
