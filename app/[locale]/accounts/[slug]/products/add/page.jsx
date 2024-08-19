import AddProduct from "@/components/accounts/product-add";
export default function Page({ params }) {
  const { slug } = params;
  console.log(slug);
  return <AddProduct store_id={slug} />;
}
