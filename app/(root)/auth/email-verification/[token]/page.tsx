import { EmailVerificationForm } from "@/components/auth/email-verification-form";
import Link from "next/link";

export default async function VerifyEmailPage({
  params,
}: {
  params: { token: string };
}) {
  const token = (await params).token;
  return (
    <div className="via-space-800 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6">
      {/* Glowing background effect */}
      <div className="bg-radial-gradient absolute inset-0 animate-pulse from-purple-500/20 via-transparent to-transparent"></div>

      {/* Reset Password container */}
      <div className="relative z-10 w-full max-w-md rounded-xl border border-gray-800 bg-gray-900/80 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-center text-3xl font-bold text-transparent">
          Email Verification
        </h1>
        <EmailVerificationForm token={token} />
        <p className="mt-6 text-sm text-center text-gray-400">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="text-purple-400 transition-all duration-300 hover:text-pink-500"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
