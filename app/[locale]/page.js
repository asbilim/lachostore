import ShopMain from "@/components/layout/main";
import { revalidateTag } from "next/cache";
import { getProducts } from "@/server/get-products";
import { notFound } from "next/navigation";
export default async function Home() {
  revalidateTag("products");
  const products = await getProducts();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-24 px-4 md:px-8 lg:px-12">
      {products.status ? (
        <ShopMain products={products} />
      ) : (
        <p className="text-center">
          we are unable to fetch products at this time
        </p>
      )}
    </main>
  );
}
