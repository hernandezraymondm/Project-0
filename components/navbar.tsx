"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { AppLogo } from "@/app/components/app-logo";
import { useEffect, useState } from "react";

export default function Navbar({ token }: { token?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-[#1e293b] bg-transparent p-2">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo with gradient text */}
        <Link href="/">
          <AppLogo />
        </Link>

        {/* Navigation links with hover effects */}
        <div className="flex items-center space-x-6">
          {/* Theme Toggle Button */}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-white"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          {!token && (
            <>
              <Link
                href="/login"
                className="group relative text-white transition-all duration-300"
              >
                Login
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/register"
                className="group relative text-white transition-all duration-300"
              >
                Register
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </>
          )}

          {/* Logout Button */}
          {token && (
            <>
              <Link
                href="/dashboard"
                className="group relative text-white transition-all duration-300"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
