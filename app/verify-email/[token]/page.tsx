import { VerifyEmail } from "@/components/verify-email";

export default function VerifyEmailPage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-8">Verify Email</h1>
      <VerifyEmail token={params.token} />
    </div>
  );
}
