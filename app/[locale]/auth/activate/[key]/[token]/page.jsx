import ActivateAccount from "@/components/activate";
export default function Page({ params }) {
  const { key, token } = params;

  return <ActivateAccount tkey={key} token={token} />;
}
