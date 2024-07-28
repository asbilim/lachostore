import ShopMain from "@/components/layout/main";
import { revalidateTag } from "next/cache";
import { getProducts } from "@/server/get-products";

export default async function Home() {
  revalidateTag("products");
  const products = await getProducts();
  const url = `https://store-r1vy.onrender.com/`;
  const interval = 30000;

  function reloadWebsite() {
    axios
      .get(url)
      .then((response) => {
        console.log(
          `Reloaded at ${new Date().toISOString()}: Status Code ${
            response.status
          }`
        );
      })
      .catch((error) => {
        console.error(
          `Error reloading at ${new Date().toISOString()}:`,
          error.message
        );
      });
  }

  setInterval(reloadWebsite, interval);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-24 px-4 md:px-8 lg:px-12">
      {products.status !== false ? (
        <ShopMain products={products} />
      ) : (
        <p className="text-center">
          we are unable to fetch products at this time
        </p>
      )}
    </main>
  );
}
