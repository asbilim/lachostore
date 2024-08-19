import AddProduct from "@/components/accounts/product-add";
export default function Page({ params }) {
  const { slug } = params;

  return <AddProduct store_id={slug} />;
}
