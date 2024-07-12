import Main from "@/components/layout/product/main";
import slugify from "react-slugify";
import NoFound from "@/components/reusables/no-found";
import ProductRecommendation from "@/components/reusables/recommandations";
import { getProducts } from "@/server/get-products";
import { revalidateTag } from "next/cache";
import { getTranslations } from "next-intl/server";

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
