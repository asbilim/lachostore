import Main from "@/components/layout/product/main";
import slugify from "react-slugify";
import NoFound from "@/components/reusables/no-found";
import ProductRecommendation from "@/components/reusables/recommandations";
import { getProducts } from "@/server/get-products";
import { revalidateTag } from "next/cache";

export default async function Shop({ params }) {
  revalidateTag("products");
  const products = await getProducts();
  const { slug, locale } = params;

  const product = findProductByName(products, slug);

  return (
    <div>
      {product.found ? (
        <Content products={products} product={product} locale={locale} />
      ) : (
        <NoFound />
      )}
    </div>
  );
}

export function Content({ product, locale, products }) {
  return (
    <>
      <Main product={product.product} locale={locale} />
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
