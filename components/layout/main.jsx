import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "../navigation";
import { ProductList } from "../datas/products";
import { Button } from "@/components/ui/button";
import slugify from "react-slugify";
import { Input } from "../ui/input";
import { useTranslations } from "next-intl";
export default function ShopMain() {
  const t = useTranslations("Index");

  return (
    <div className="flex w-full h-full my-12  flex-col gap-8 items-center ">
      <div className="w-full flex flex-col max-w-6xl gap-4">
        <CustomLink text={t("section_one.title")} href="" />
        <p className="text-sm leading-relaxed">
          {t("section_one.description")}
        </p>
      </div>
      <div className="w-full flex flex-col max-w-6xl  gap-4">
        <h2 className="text-primary mb-12">{t("section_two.subtitle")}</h2>
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
        <CustomLink text={t("section_two.title")} href="" />
        <p className="text-sm leading-relaxed">
          {t("section_two.description")}
        </p>
      </div>
      <div className="w-full flex flex-col max-w-6xl  gap-4">
        <h2 className="text-primary mb-12">{t("section_two.subtitle")}</h2>
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
          <Button className="flex ">{t("button")}</Button>
        </div>
      </div>
      <section className="w-full flex flex-col max-w-6xl  gap-4">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              {t("section_three.title")}
            </h1>
            <p className="text-muted-foreground md:text-xl">
              {t("section_three.description")}
            </p>

            <Button>
              <Link href="/">{t("section_three.button")}</Link>
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
        <div className="flex flex-col gap-2 md:flex-row w-full maw-w-5xl border-y py-6 justify-between items-start md:items-center">
          <div className="flex flex-col gap-3">
            <h2 className="font-bold">{t("newsletter.title")}</h2>
            <p className="text-sm">{t("newsletter.message")}</p>
          </div>
          <div className="flex gap-2">
            <Input placeholder={t("newsletter.placeholder")} />
            <Button>{t("newsletter.button")}</Button>
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
