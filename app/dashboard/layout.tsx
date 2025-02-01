import type React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col h-screen overflow-hidden">
          <DashboardNavbar />
          <SidebarInset className="flex-1 overflow-scroll">
            <header className="fixed top-[14px] z-10">
              <SidebarTrigger />
            </header>
            <main className="flex-1 p-7" id="main">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
