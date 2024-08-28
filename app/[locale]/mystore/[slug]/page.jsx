import { getProducts } from "@/server/get-products";
import { revalidateTag } from "next/cache";
import { getUniqueVendors } from "@/components/reusables/functions";
import StorePage from "@/components/mystore/main";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  revalidateTag("products");
  const products = await getProducts();
  const { locale, slug } = params;

  const stores = getUniqueVendors(products);
  const store = stores.find((s) => s.slug === slug);

  const siteName = "Lachofit store";
  const baseUrl = "https://www.shop.lachofit.com";

  return {
    title: `${store.name}`,
    description: store.description.substring(0, 160),
    
    alternates: {
      canonical: `${baseUrl}/${locale}/mystore/${slug}`,
      languages: {
        en: `${baseUrl}/en/mystore/${slug}`,
        fr: `${baseUrl}/fr/mystore/${slug}`,
      },
    },
    openGraph: {
      title: `${store.name} on Lachofit`,
      description: store.description,
      url: `${baseUrl}/${locale}/shop/product/${slug}`,
      siteName: siteName,
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${store.name} | ${siteName}`,
      description: store.description.substring(0, 200),
      images: [store.image],
    },

    robots: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

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
