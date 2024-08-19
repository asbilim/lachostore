import PasswordResetForm from "@/components/password";
export default function ResetPassword({ params }) {
  const { token } = params;

  return (
    <div className="flex w-full flex-col items-center justify-center my-12 min-h-[70vh] px-4">
      <PasswordResetForm token={token} />
    </div>
  );
}
