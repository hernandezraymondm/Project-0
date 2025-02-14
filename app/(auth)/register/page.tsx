import { RegisterForm } from "@/components/auth/register-form";
import { AppLogo } from "@/components/reusable/app-logo";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="via-space-800 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6">
      {/* Glowing background effect */}
      <div className="bg-radial-gradient absolute inset-0 animate-pulse from-purple-500/20 via-transparent to-transparent"></div>

      {/* Register container */}
      <div className="relative z-10 w-full max-w-4xl rounded-xl border border-gray-800 bg-gray-900/80 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8">
          <AppLogo size="sm" />
        </div>
        <RegisterForm />
        <p className="text-sm mt-6 text-center text-gray-400">
          Already have an account?{" "}
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
