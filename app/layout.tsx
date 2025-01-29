import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Inter, Audiowide } from "next/font/google"; // Import Audiowide
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "next-themes";

// Initialize Inter font
const inter = Inter({ subsets: ["latin"] });

// Initialize Audiowide font
const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400", // Audiowide only has one weight (400)
  variable: "--font-audiowide", // Define a CSS variable for Audiowide
});

export const metadata: Metadata = {
  title: "Unknown Project",
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
      {/* Apply both Inter and Audiowide fonts to the body */}
      <body className={`${inter.className} ${audiowide.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar token={token} />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
