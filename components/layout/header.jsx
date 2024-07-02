"use client";
import Image from "next/image";
import logo from "@/public/lachostore.png";
import { Input } from "../ui/input";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const pathNames = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Shop",
    path: "/products",
  },
  {
    name: "Cart",
    path: "/cart",
  },
  {
    name: "Application",
    path: "/application",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

export default function Header() {
  const pathName = usePathname();

  return (
    <div className="flex bg-secondary px-4 md:px-12 md:pb-6 flex-col items-center justify-center">
      <div className="flex w-full  justify-between items-center">
        {/* logo */}
        <Link href="/">
          <Image
            src={logo}
            width={300}
            alt="lachofit logo"
            className="hidden md:block"
          />
          <Image
            src={logo}
            width={140}
            alt="lachofit logo"
            className="md:hidden"
          />
        </Link>
        {/* search part */}
        <div className="research md:flex hidden items-center  border rounded-2xl p-1 gap-2 bg-white w-full max-w-xl">
          <Input
            className="bg-transparent border-0 focus:outline-none outline-none"
            placeholder="search a product..."
          />
          <Search className="cursor-pointer" />
        </div>
        {/* action parts */}
        <div className="actions flex gap-6 items-center  justify-center">
          <DynamicCartIcon itemCount={5} />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserRound className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Login</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            variant="outline"
            className={"md:hidden flex items-center " + buttonVariants}>
            <Sheet>
              <SheetTrigger>
                <Menu />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Lachofit the place to be</SheetTitle>
                  <SheetDescription>
                    <div className="flex flex-col  justify-center w-full items-center gap-6 mt-12">
                      {pathNames.map((path) => {
                        return (
                          <h2
                            key={path.name}
                            className={
                              path.path === pathName
                                ? "text-primary font-bold"
                                : "hover:text-primary"
                            }>
                            <Link href={path.path}>{path.name}</Link>
                          </h2>
                        );
                      })}
                    </div>
                    <div className="research my-12 flex items-center  border rounded-2xl p-1 gap-2 bg-white w-full max-w-xl">
                      <Input
                        className="bg-transparent border-0 focus:outline-none outline-none"
                        placeholder="search a product..."
                      />
                      <Search className="cursor-pointer" />
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      {/* second parts with links */}
      <div className="md:flex hidden justify-center w-full items-center gap-12">
        {pathNames.map((path) => {
          return (
            <h2
              key={path.name}
              className={
                path.path === pathName
                  ? "text-primary font-bold"
                  : "hover:text-primary"
              }>
              <Link href={path.path}>{path.name}</Link>
            </h2>
          );
        })}
      </div>
    </div>
  );
}

export const DynamicCartIcon = ({ itemCount }) => {
  return (
    <div className="flex">
      {itemCount && itemCount > 0 ? (
        <div className="flex relative">
          <Badge
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              transform: "translate(50%, -50%)",
              color: "white",
              borderRadius: "50%",
              padding: "0.2em 0.4em",
              fontSize: "12px",
              fontWeight: "bold",
            }}>
            {itemCount}
          </Badge>
          <ShoppingBag className="cursor-pointer" />
        </div>
      ) : (
        <ShoppingBag className="cursor-pointer" />
      )}
    </div>
  );
};
