import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <div className="via-space-800 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6">
      {/* Glowing background effect */}
      <div className="bg-radial-gradient absolute inset-0 animate-pulse from-purple-500/20 via-transparent to-transparent"></div>

      {/* Reset Password container */}
      <div className="relative z-10 w-full max-w-md rounded-xl border border-gray-800 bg-gray-900/80 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-center text-3xl font-bold text-transparent">
          Reset Password
        </h1>
        <ResetPasswordForm />
        <p className="mt-6 text-center text-gray-300">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-purple-400 transition-all duration-300 hover:text-pink-500"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
