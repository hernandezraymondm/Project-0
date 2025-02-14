import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Header } from "@/components/header/header";
import { cookies } from "next/headers";
import { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your dashboard activities and insights",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar:state");
  const defaultOpen = sidebarState ? sidebarState.value === "true" : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
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
