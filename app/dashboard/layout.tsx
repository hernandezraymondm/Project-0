import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import type React from "react";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Modern dashboard with dark theme",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <AppSidebar />
              <div className="flex-1 overflow-auto">{children}</div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
