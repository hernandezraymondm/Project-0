import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Space Shield",
  description:
    "Your trusted solution for secure session management, TOTP 2FA, and email verification.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          (inter.className,
          "min-h-full bg-gradient-to-br from-gray-900 via-space-800 to-black overflow-hidden")
        }
      >
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
