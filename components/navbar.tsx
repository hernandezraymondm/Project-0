"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { AppLogo } from "@/app/components/app-logo";

export default function Navbar({ token }: { token?: string }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="bg-card backdrop-blur-md border-b border-gray-800 text-primary p-2 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo with gradient text */}
        <Link href="/">
          <AppLogo size="xs" />
        </Link>

        {/* Navigation links with hover effects */}
        <div className="flex items-center space-x-6">
          {/* Theme Toggle Button */}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-gray-300 hover:text-white"
          >
            {theme && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          {!token && (
            <>
              <Link
                href="/login"
                className="relative text-gray-300 hover:text-white transition-all duration-300 group"
              >
                Login
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/register"
                className="relative text-gray-300 hover:text-white transition-all duration-300 group"
              >
                Register
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </>
          )}

          {/* Logout Button */}
          {token && (
            <>
              <Link
                href="/dashboard"
                className="relative text-gray-300 hover:text-white transition-all duration-300 group"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
