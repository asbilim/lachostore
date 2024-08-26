import ShopMain from "@/components/layout/main";
import { revalidateTag } from "next/cache";
import {
  getProducts,
  getCustomerChoicesProducts,
  getRecommendedProducts,
  getTrendingProducts,
} from "@/server/get-products";

export default async function Home() {
  revalidateTag("products");
  revalidateTag("customer-choices-products");
  revalidateTag("recommended-products");
  revalidateTag("trending-products");

  const products = await getProducts();
  const customer_choices = await getCustomerChoicesProducts();
  const recommended_products = await getRecommendedProducts();
  const trending_products = await getTrendingProducts();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-24 px-4 md:px-8 lg:px-12">
      {products.status !== false ? (
        <ShopMain
          products={products}
          customer_choices={customer_choices}
          trending_products={trending_products}
          recommended_products={recommended_products}
        />
      ) : (
        <p className="text-center">
          we are unable to fetch products at this time
        </p>
      )}
    </main>
  );
}
