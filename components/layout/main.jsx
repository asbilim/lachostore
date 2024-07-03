import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductList } from "../datas/products";
import { Button } from "@/components/ui/button";
import slugify from "react-slugify";
import { Input } from "../ui/input";
export default function ShopMain() {
  return (
    <div className="flex w-full h-full my-12  flex-col gap-8 items-center ">
      <div className="w-full flex flex-col max-w-6xl gap-4">
        <CustomLink text="Become a seller today" href="" />
        <p className="text-sm leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime velit
          esse, ratione dolorum quia nam obcaecati ut vitae. Dolor et ad enim
          tempore necessitatibus. Possimus ducimus quasi similique nulla enim.
        </p>
      </div>
      <div className="w-full flex flex-col max-w-6xl  gap-4">
        <h2 className="text-primary mb-12">Featured products</h2>
        <div className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ProductList.slice(0, 10).map((item) => {
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
      <div className="w-full flex flex-col max-w-6xl gap-4">
        <CustomLink text="Achieve your goals: talk to a professional" href="" />
        <p className="text-sm leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime velit
          esse, ratione dolorum quia nam obcaecati ut vitae. Dolor et ad enim
          tempore necessitatibus. Possimus ducimus quasi similique nulla enim.
        </p>
      </div>
      <div className="w-full flex flex-col max-w-6xl  gap-4">
        <h2 className="text-primary mb-12">Featured products</h2>
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
      <div className="w-full flex flex-col max-w-6xl gap-4 my-16">
        <div className="flex">
          <Button className="flex ">View All the products</Button>
        </div>
      </div>
      <section className="w-full flex flex-col max-w-6xl  gap-4">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Become a Partner Today
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Create your account now and start earning! As a partner,{" "}
              {"you'll"}
              have access to unique affiliate links for all our products.
            </p>
            <p className="mt-2 text-muted-foreground md:text-xl">
              Earn a commission on every sale made through your links. Join our
              community and start growing your revenue today!
            </p>
            <Button>
              <Link href="/">Sign Up and Earn</Link>
            </Button>
          </div>
          <Image
            src="https://placehold.co/400x600.png"
            width={400}
            height={400}
            alt="Hero Image"
            className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center"
          />
        </div>
      </section>
      <div className="flex my-12 w-full max-w-6xl items-center">
        <div className="flex w-full maw-w-5xl border-y py-6 justify-between items-center">
          <div className="flex flex-col gap-3">
            <h2 className="font-bold">Subscribe to our newsletter</h2>
            <p className="text-sm">
              The latest news , articles , and resources , sent to your inbox
              weekly
            </p>
          </div>
          <div className="flex gap-2">
            <Input placeholder="youremail@gmail.com" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
      <div className="flex max-w-6xl w-full items-center">
        <div className="flex w-full justify-around">
          <p>partner1</p>
          <p>partner 2</p>
          <p>partner 2</p>
          <p>partner 2</p>
        </div>
      </div>
    </div>
  );
}

export const CustomLink = ({ text, href, principal = false }) => {
  return (
    <Link href={href} className="flex items-center gap-2">
      <span className="text-primary text-xl font-semibold ">{text}</span>
      <ArrowRight />
    </Link>
  );
};
