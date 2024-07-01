import { CustomLink } from "@/components/reusables/links";
import Link from "next/link";
import Image from "next/image";
import { ProductList } from "../datas/products";
import slugify from "react-slugify";
export default function ProductRecommendation() {
  return (
    <div className="flex w-full justify-center items-center my-12 mb-36 ">
      <div className="flex w-full max-w-6xl flex-col gap-6">
        <div className="w-full flex flex-col max-w-6xl  gap-4">
          <h2 className="text-primary mb-12">You may also like</h2>
          <div className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ProductList.slice(0, 8).map((item) => {
              return (
                <Link
                  href={"/shop/product/" + slugify(item.name)}
                  key={item.id}
                  prefetch={true}>
                  <div className="flex flex-col gap-2 w-[150px] md:w-[250px]">
                    <Image
                      src="https://placehold.co/600x400.png"
                      alt="banana"
                      width="600"
                      height={400}
                      className="w-full"
                      dangerouslyAllowSVG={true}
                    />
                    <h3 className="text-sm truncate">{item.name}</h3>
                    <div className="flex gap-2 items-center ">
                      <span className="text-primary text-sm">
                        FCFA {item.sale_price}
                      </span>
                      <span className="text-gray-500 text-xs line-through">
                        {item.price}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
