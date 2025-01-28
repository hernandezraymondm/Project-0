import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Space Shield",
  description:
    "Your trusted solution for secure session management, TOTP 2FA, and email verification.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar token={token} />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
