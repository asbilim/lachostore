"use client";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/hooks/use-currency";
import slugify from "react-slugify";
export default function MainPageProductCard({ item }) {
  const { currency, convertCurrency } = useCurrency();

  return (
    <Link
      href={"/en/shop/product/" + slugify(item.name)}
      key={item.id}
      prefetch={true}>
      <div className="flex flex-col gap-2 w-[150px] md:w-[250px]">
        <Image
          src={item.image || "https://placehold.co/400x600.png"}
          alt={item.name}
          width="600"
          height={400}
          className="w-full h-48 object-contain"
          dangerouslyAllowSVG={true}
          unoptimized
        />
        <h3 className="text-sm truncate">{item.name}</h3>
        <div className="flex gap-2 items-center ">
          <span className="text-primary text-sm">
            {currency + " "}
            {parseFloat(
              convertCurrency(item.sale_price, "XAF", currency)
            ).toFixed(2)}
          </span>
          <span className="text-gray-500 text-xs line-through">
            {parseFloat(convertCurrency(item.price, "XAF", currency)).toFixed(
              2
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
