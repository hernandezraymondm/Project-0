import type React from "react";
import { Menu } from "lucide-react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-col h-screen overflow-hidden">
          <DashboardNavbar />
          <SidebarInset className="flex-1 overflow-scroll">
            <header className="fixed top-[14px] z-10">
              <SidebarTrigger icon={<Menu />} />
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
