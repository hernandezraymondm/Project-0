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
      <div className="flex flex-1 min-h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col h-screen overflow-hidden">
          <Header />
          <SidebarInset className="flex-1 overflow-scroll">
            <main className="flex-1 pb-7">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
