import Main from "@/components/layout/product/main";
import slugify from "react-slugify";
import NoFound from "@/components/reusables/no-found";
import ProductRecommendation from "@/components/reusables/recommandations";
import { getProducts } from "@/server/get-products";
import { revalidateTag } from "next/cache";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { slug, locale } = params;
  const products = await getProducts();
  const productResult = findProductByName(products, slug);
  const t = await getTranslations("Product");

  const siteName = "Lachofit store";
  const baseUrl = "https://www.shop.lachofit.com";

  if (!productResult.found) {
    return generateNotFoundMetadata(t, baseUrl, siteName, locale);
  }

  const product = productResult.product;

  const structuredData = generateStructuredData(product, baseUrl);

  return {
    title: `${product.name || t("unknown_product")} | ${siteName}`,
    description: (
      product.description || t("no_description_available")
    ).substring(0, 160),
    keywords: [
      product.name,
      ...(product.categories || []),
      "buy online",
      locale,
    ].filter(Boolean),
    alternates: {
      canonical: `${baseUrl}/${locale}/product/${slug}`,
      languages: {
        en: `${baseUrl}/en/product/${slug}`,
        fr: `${baseUrl}/fr/product/${slug}`,
        // Add more languages as needed
      },
    },
    openGraph: {
      title: `${product.name || t("unknown_product")} - ${t(
        "available"
      )} | ${siteName}`,
      description: product.description || t("no_description_available"),
      url: `${baseUrl}/${locale}/shop/product/${slug}`,
      siteName: siteName,
      images: [
        {
          url: product.image || `${baseUrl}/default-product-image.jpg`,
          width: 1200,
          height: 630,
          alt: product.name || t("unknown_product"),
        },
      ],
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name || t("unknown_product")} | ${siteName}`,
      description: (
        product.description || t("no_description_available")
      ).substring(0, 200),
      images: [product.image],
    },
    other: {
      "price:amount": product.price?.toString() || "0",
      "price:currency": product.currency || "USD",
      "og:availability": product.inStock ? "instock" : "outofstock",
    },
    robots: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    metadataBase: new URL(baseUrl),
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    icons: {
      icon: "/favicon.ico",
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    themeColor: "#your-brand-color",
    colorScheme: "light dark",
    alternativeLanguage: [
      { code: "en-US", url: `${baseUrl}/en/product/${slug}` },
      { code: "fr-FR", url: `${baseUrl}/fr/product/${slug}` },
    ],
    verification: {
      google: "your-google-site-verification-code",
      yandex: "your-yandex-verification-code",
      bing: "your-bing-verification-code",
    },
    applicationName: siteName,
    referrer: "origin-when-cross-origin",
    formatDetection: {
      telephone: false,
    },
    manifest: `${baseUrl}/site.webmanifest`,
    category: product.categories?.[0] || t("uncategorized"),
    appLinks: {
      ios: {
        url: `your-app-scheme://product/${product.id || slug}`,
        app_store_id: "your-app-store-id",
      },
      android: {
        package: "your.android.package.name",
        app_name: siteName,
      },
    },
    other: {
      ...structuredData,
    },
  };
}

function generateNotFoundMetadata(t, baseUrl, siteName, locale) {
  return {
    title: `${t("product_not_found")} | ${siteName}`,
    description: t("product_not_found_description"),
    robots: { index: false, follow: true },
    alternates: { canonical: `${baseUrl}/${locale}/404` },
    openGraph: {
      title: `${t("product_not_found")} | ${siteName}`,
      description: t("product_not_found_description"),
      url: `${baseUrl}/${locale}/404`,
      siteName: siteName,
      images: [
        {
          url: `${baseUrl}/not-found-image.jpg`,
          width: 1200,
          height: 630,
          alt: t("product_not_found"),
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${t("product_not_found")} | ${siteName}`,
      description: t("product_not_found_description"),
      images: [`${baseUrl}/not-found-image.jpg`],
    },
  };
}

function generateStructuredData(product, baseUrl) {
  return {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name || "Unknown Product",
      image: product.images || [`${baseUrl}/default-product-image.jpg`],
      description: product.description || "No description available",
      sku: product.sku || "N/A",
      mpn: product.mpn || "N/A",
      brand: {
        "@type": "Brand",
        name: product.brand || "Unknown Brand",
      },
      offers: {
        "@type": "Offer",
        url: `${baseUrl}/product/${product.slug || "unknown"}`,
        priceCurrency: product.currency || "USD",
        price: product.price || 0,
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "Your Store Name",
        },
      },
    }),
  };
}

export default async function Shop({ params }) {
  revalidateTag("products");
  const products = await getProducts();
  const { slug, locale } = params;
  const t = await getTranslations("Product");
  const product = findProductByName(products, slug);

  const translations = {
    description: t("description"),
    specifications: t("specifications"),
    reviews: t("reviews"),
    write_review: t("write_review"),
    name: t("name"),
    email: t("email"),
    rating: t("rating"),
    review: t("review"),
    submit_review: t("submit_review"),
    product_added: t("product_added"),
    product_added_message: t("product_added_message"),
    free_shipping: t("free_shipping"),
    return_policy: t("return_policy"),
    see_all_reviews: t("see_all_reviews"),
    price: t("price"),
    color: t("color"),
    size: t("size"),
    quantity: t("quantity"),
    available: t("available"),
    stock: t("stock"),
    low: t("low"),
    medium: t("medium"),
    high: t("high"),
    continue_cart: t("continue_to_cart"),
    add_cart: t("add_to_cart"),
    remove: t("remove"),
  };

  return (
    <div>
      {product.found ? (
        <Content
          products={products}
          product={product}
          locale={locale}
          translations={translations}
        />
      ) : (
        <NoFound />
      )}
    </div>
  );
}

export function Content({ product, locale, products, translations }) {
  return (
    <>
      <Main
        product={product.product}
        locale={locale}
        translations={translations}
      />
      <ProductRecommendation products={products} />
    </>
  );
}

export function findProductByName(productList, productSlug) {
  const product = productList.find(
    (product) => slugify(product.name) === productSlug
  );

  if (product) {
    return { found: true, product };
  } else {
    return { found: false };
  }
}
