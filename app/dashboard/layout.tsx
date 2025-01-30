import type React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen overflow-hidden z-50">
        <DashboardNavbar />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar />
          <SidebarInset className="flex-1 overflow-auto">
            <main className="flex-1 p-6" id="main">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
