import { revalidateTag } from "next/cache";
import MainShop from "./main";
import { getProducts } from "@/server/get-products";
import { getTranslations } from "next-intl/server";
export default async function Shop({ params }) {
  revalidateTag("products");
  const products = await getProducts();
  const { locale } = params;
  const t = await getTranslations("Shop");
  return (
    <MainShop
      title={t("title")}
      description={t("description")}
      link_1={t("button_1")}
      link_2={t("button_2")}
      filters={t("filter")}
      prod={t("products")}
      products={products}
      locale={locale}
    />
  );
}
