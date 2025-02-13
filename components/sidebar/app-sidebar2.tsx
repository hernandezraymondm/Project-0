"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Table2,
  FileText,
  Layers,
  Monitor,
  Palette,
  User,
  Lock,
  AlertCircle,
  Github,
  LogOut,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Table2, label: "Tables", href: "/tables" },
  { icon: FileText, label: "Forms", href: "/forms" },
  { icon: Layers, label: "UI", href: "/ui" },
  { icon: Monitor, label: "Responsive", href: "/responsive" },
  { icon: Palette, label: "Styles", href: "/styles" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Lock, label: "Login", href: "/login" },
  { icon: AlertCircle, label: "Error", href: "/error" },
  { icon: Github, label: "GitHub", href: "/github" },
];

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="h-14 px-4">
        <div className="flex h-full items-center gap-2 text-lg font-semibold">
          One
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild tooltip={item.label}>
                <a href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="bg-blue-600 text-white hover:bg-blue-700">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
