import StatusPage from "@/components/reusables/status-card";
export default function Page({ params }) {
  const { slug } = params;

  const onClose = () => console.log("");

  return (
    <div className="flex items-center justify-center w-full my-12">
      <StatusPage
        status={slug}
        title="The payment have been proceed "
        message="We've sent all the details of the transaction to the email you provided"
        supportLink="https://lachofit.com/contact"
      />
    </div>
  );
}
