"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Box,
  DollarSign,
  Users,
  FileText,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Professional color palette
const colors = {
  primary: "#4F46E5", // Indigo
  secondary: "#10B981", // Emerald
  accent: "#3B82F6", // Blue
  background: "#F8FAFC", // Light slate
  text: "#1E293B", // Slate-800
  border: "#E2E8F0", // Slate-200
};

const modules = [
  {
    name: "Inventory",
    icon: Box,
    color: colors.primary,
    pages: ["Overview", "Stock Levels", "Reorder Points", "Suppliers"],
  },
  {
    name: "Sales",
    icon: DollarSign,
    color: colors.secondary,
    pages: ["Dashboard", "Orders", "Customers", "Products"],
  },
  {
    name: "Employee",
    icon: Users,
    color: colors.accent,
    pages: ["Directory", "Performance", "Payroll"],
  },
  {
    name: "Requests",
    icon: FileText,
    color: "#F59E0B", // Amber
    pages: ["All Requests", "Pending", "Approved"],
  },
  {
    name: "Approval",
    icon: CheckSquare,
    color: "#EF4444", // Red
    pages: ["Overtime", "Leave", "Expenses"],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      className="w-64 border-r"
      id="sidebar"
      style={{ borderColor: colors.border }}
    >
      <SidebarHeader
        className="px-6 py-5 border-b"
        style={{ borderColor: colors.border }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <span className="text-white font-semibold">AP</span>
          </div>
          <span
            className="text-lg font-semibold"
            style={{ color: colors.text }}
          >
            Admin Pro
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarMenu className="space-y-2">
          {modules.map((module) => (
            <SidebarMenuItem key={module.name}>
              <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className="w-full justify-between rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors"
                    style={{ color: colors.text }}
                  >
                    <div className="flex items-center gap-3">
                      <module.icon
                        className="h-5 w-5"
                        style={{ color: module.color }}
                      />
                      <span className="font-medium">{module.name}</span>
                    </div>
                    <ChevronDown
                      className="h-4 w-4 text-gray-400 transition-transform"
                      style={{ color: colors.text }}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-2 ml-4 overflow-hidden">
                  <SidebarMenuSub
                    className="space-y-1 border-l-2 pl-4"
                    style={{ borderColor: colors.border }}
                  >
                    {module.pages.map((page) => {
                      const href = `/${module.name.toLowerCase()}/${page.toLowerCase().replace(" ", "-")}`;
                      const isActive = pathname === href;

                      return (
                        <SidebarMenuSubItem key={page}>
                          <SidebarMenuSubButton
                            asChild
                            className={cn(
                              "w-full px-3 py-2 rounded-md text-sm transition-colors",
                              isActive
                                ? "font-semibold bg-blue-50"
                                : "hover:bg-gray-50"
                            )}
                            style={{
                              color: isActive ? colors.primary : colors.text,
                            }}
                          >
                            <Link href={href}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: module.color }}
                                />
                                {page}
                              </div>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
