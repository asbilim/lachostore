import { fetchData } from "@/components/functions/fetch-data";
import EditProduct from "@/components/accounts/product-edit";
export default async function Product({ params }) {
  const { id } = params;
  const datas = await fetchData(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/api/products/${id}/`
  );

  if (!datas) return <p>Product not found</p>;
  return <EditProduct productId={id} store_id={datas.vendor.id} />;
}
