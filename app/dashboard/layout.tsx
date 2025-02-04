import { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Header } from "@/components/header/header";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your dashboard activities and insights",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-1 overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <div className="flex h-screen flex-1 flex-col overflow-hidden">
          {/* Header */}
          <Header />

          {/* Scrollable Content Area */}
          <SidebarInset className="flex-1 overflow-y-auto">
            <main className="flex-1 px-8 pb-20 pt-0">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
