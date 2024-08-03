import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "../navigation";
import { Button } from "@/components/ui/button";
import slugify from "react-slugify";
import { useTranslations } from "next-intl";
import { revalidateTag } from "next/cache";
import MainPageProductCard from "./main-product";

import NewsletterSubscribe from "../reusables/newsletter";
export default function ShopMain({ products }) {
  revalidateTag("products");
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
          {products.map((item) => {
            return <MainPageProductCard item={item} key={item.name} />;
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
          {products.map((item) => {
            return <MainPageProductCard item={item} key={item.name} />;
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
            src="https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
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
          <NewsletterSubscribe
            placeholder={t("newsletter.placeholder")}
            content={t("newsletter.button")}
          />
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
