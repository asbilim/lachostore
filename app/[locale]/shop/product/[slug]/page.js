import Main from "@/components/layout/product/main";
import { ProductList } from "@/components/datas/products";
import slugify from "react-slugify";
import NoFound from "@/components/reusables/no-found";
import ProductDescription from "@/components/layout/product/description";
import ProductRecommendation from "@/components/reusables/recommandations";
export default function Shop({ params }) {
  const { slug, locale } = params;

  const product = findProductByName(ProductList, slug);

  return (
    <div>
      {product.found ? (
        <Content product={product} locale={locale} />
      ) : (
        <NoFound />
      )}
    </div>
  );
}

export function Content({ product, locale }) {
  return (
    <>
      <Main product={product.product} locale={locale} />
      <ProductRecommendation />
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