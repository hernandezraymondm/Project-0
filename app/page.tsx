import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-space-800 to-black p-6">
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-500/20 via-transparent to-transparent animate-pulse"></div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 max-w-2xl">
        {/* Futuristic title with gradient text */}
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient">
          Space Shield
        </h1>

        {/* Subtitle with glowing effect */}
        <h2 className="text-xl font-medium text-gray-300">
          Your trusted solution for{" "}
          <span className="text-purple-400 font-semibold">
            secure session management
          </span>
          , <span className="text-pink-400 font-semibold">TOTP 2FA</span>, and{" "}
          <span className="text-blue-400 font-semibold">
            email verification
          </span>
          .
        </h2>

        {/* Buttons with hover animations */}
        <div className="flex gap-4 justify-center">
          <Button
            asChild
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-purple-500 text-purple-500 hover:bg-purple-500/10 hover:border-purple-600 hover:text-purple-600 transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>

      {/* Floating stars animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white rounded-full animate-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 5}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: `${Math.random() * 0.5 + 0.2}`, // Random opacity for subtlety
            }}
          ></div>
        ))}
      </div>
    </main>
  );
}
