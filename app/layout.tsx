import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Inter, Audiowide, Jura } from "next/font/google";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import "./globals.css";

// Initialize Inter font
const inter = Inter({ subsets: ["latin"] });

// Initialize Audiowide font
const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400", // Audiowide only has one weight (400)
  variable: "--font-audiowide", // Define a CSS variable for Audiowide
});

// Initialize Jura font
const jura = Jura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jura",
});

export const metadata: Metadata = {
  title: "Unknown Project",
  description:
    "Your trusted solution for secure session management, TOTP 2FA, and email verification.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${audiowide.variable} ${jura.variable}`}
      >
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <AuthProvider>
            {/* <DisableDevToolsProvider /> */}
            {children}
            <Toaster
              richColors
              position="bottom-center"
              duration={20000}
              closeButton
            />
          </AuthProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
