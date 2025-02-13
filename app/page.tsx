import { TextCrawl } from "../components/landing/text-crawl";
import { AppLogo } from "../components/reusable/app-logo";
import { Navbar } from "@/components/reusable/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="via-space-800 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-[#2e2838]">
      {/* Glowing background effect */}
      <div className="bg-radial-gradient absolute inset-0 animate-pulse from-purple-500/20 via-transparent to-transparent"></div>
      <Navbar />
      {/* Content */}
      <div className="relative z-10 max-w-2xl space-y-8 text-center">
        {/* Futuristic title with gradient text */}

        <AppLogo size="lg" />

        {/* Subtitle with glowing effect */}
        <h2 className="pt-14 font-jura text-xl font-medium text-white">
          A NEXT.js starter kit so you don&apos;t have to start from scratch.
          Equipped with{" "}
          <span className="font-semibold text-purple-400">
            secure session management
          </span>
          , <span className="font-semibold text-pink-400">TOTP 2FA</span>, and{" "}
          <span className="font-semibold text-blue-400">
            email verification
          </span>
          .
        </h2>

        {/* Buttons with hover animations */}
        <div className="flex justify-center gap-4">
          <Button
            asChild
            className="transform bg-gradient-to-r from-purple-600 to-violet-600 text-white transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-pink-700"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="transform border-purple-500 text-purple-500 transition-all duration-300 hover:scale-105 hover:border-purple-600 hover:bg-purple-500/10 hover:text-purple-600"
          >
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>

      {/* Text Crawl */}
      <TextCrawl />

      {/* Floating stars animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="animate-star absolute h-[1px] w-[1px] rounded-full bg-white"
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
