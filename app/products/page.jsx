import MainShop from "./main";
import NoFound from "@/components/reusables/no-found";
import { ProductList } from "@/components/datas/products";

export default function Shop() {
  return <MainShop products={ProductList} />;
}
