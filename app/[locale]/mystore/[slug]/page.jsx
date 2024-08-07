import { getProducts } from "@/server/get-products";
import { revalidateTag } from "next/cache";
import { getUniqueVendors } from "@/components/reusables/functions";
import StorePage from "@/components/mystore/main";
import { notFound } from "next/navigation";
export default async function Page({ params }) {
  revalidateTag("products");
  const products = await getProducts();
  const { locale, slug } = params;

  const stores = getUniqueVendors(products);
  const store = stores.find((s) => s.slug === slug);

  if (!store) {
    notFound();
  }

  const storeProducts = products.filter(
    (product) => product.vendor.id === store.id
  );

  return <StorePage store={store} products={storeProducts} locale={locale} />;
}
