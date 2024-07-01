import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-4 px-4 py-6 text-center md:py-8 md:gap-6 lg:gap-8 xl:gap-12">
        <div className="flex flex-col items-start space-y-2 md:items-center md:space-y-0">
          <Link href="#" className="inline-block" prefetch={false}>
            <span className="sr-only">Lachoshop</span>
            <div className="h-6 w-auto fill-current" />
          </Link>
          <p className="text-xs">Revolutionizing the shopping experience.</p>
        </div>
        <nav className="flex items-center justify-center space-x-4 text-sm md:space-x-6 md:order-last md:justify-center lg:order-2">
          <Link href="#" className="" prefetch={false}>
            Home
          </Link>
          <Link href="#" className="" prefetch={false}>
            Features
          </Link>
          <Link href="#" className="" prefetch={false}>
            Pricing
          </Link>
          <Link href="#" className="" prefetch={false}>
            Contact
          </Link>
        </nav>
        <div className="flex items-center justify-start space-x-4 text-sm md:justify-end md:order-2 lg:space-x-6 lg:order-last">
          <div className="flex items-center space-x-4">
            <Link href="#" className="" prefetch={false}>
              <Facebook className="w-4 h-4" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="" prefetch={false}>
              <Twitter className="w-4 h-4" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="" prefetch={false}>
              <Instagram className="w-4 h-4" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
