import { NewPasswordForm } from "@/components/new-password-form";

export default function ResetPasswordPage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-8">Set New Password</h1>
      <NewPasswordForm token={params.token} />
    </div>
  );
}
