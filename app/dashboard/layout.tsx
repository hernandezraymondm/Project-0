import { SidebarProvider } from "@/components/ui/sidebar";
import type React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-1 min-h-screen overflow-hidden ">
        <AppSidebar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </SidebarProvider>
  );
}
