import MainShop from "./main";
import NoFound from "@/components/reusables/no-found";
import { ProductList } from "@/components/datas/products";

export default function Shop({ params }) {
  const { locale } = params;
  return <MainShop products={ProductList} locale={locale} />;
}
