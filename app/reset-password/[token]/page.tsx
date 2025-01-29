import { NewPasswordForm } from "@/components/auth/new-password-form";
import Link from "next/link";

export default async function ResetPasswordPage({
  params,
}: {
  params: { token: string };
}) {
  const token = (await params)?.token;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-space-800 to-black p-6">
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-500/20 via-transparent to-transparent animate-pulse"></div>

      {/* Reset Password container */}
      <div className="relative z-10 w-full max-w-md bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
          Set New Password
        </h1>
        <NewPasswordForm token={token} />
        <p className="mt-6 text-center text-gray-300">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-purple-400 hover:text-pink-500 transition-all duration-300"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
