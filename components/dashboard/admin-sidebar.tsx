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
import { AppLogo } from "@/app/components/app-logo";

const colors = {
  primary: "#b046e5",
  secondary: "#10B981",
  accent: "#3B82F6",
  text: "#e3e3e3",
  border: "#5b5c86",
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
    color: "#F59E0B",
    pages: ["All Requests", "Pending", "Approved"],
  },
  {
    name: "Approval",
    icon: CheckSquare,
    color: "#44e1ef",
    pages: ["Overtime", "Leave", "Expenses"],
  },
  {
    name: "Maintenance",
    icon: CheckSquare,
    color: "#EF4444",
    pages: ["Settings", "Libraries", "Audit Logs"],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="w-64 border-r z-50" id="sidebar">
      <SidebarHeader className="px-6 border-b bg-accent-primary border-[#6a5b83]">
        <Link href="/" className="flex items-center">
          <AppLogo />
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-5 px-3 bg-accent-primary">
        <SidebarMenu className="space-y-2">
          {modules.map((module) => (
            <SidebarMenuItem key={module.name}>
              <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full justify-between rounded-lg py-3 transition-colors wiggle-on-hover text-gray-400 hover:text-white">
                    <div className="flex items-center gap-3">
                      <div className="wiggle-icon drop-shadow-lg">
                        <module.icon
                          className="h-5 w-5 transition-transform duration-300"
                          style={{ color: module.color }}
                        />
                      </div>
                      <span className="font-semibold drop-shadow-lg">
                        {module.name}
                      </span>
                    </div>
                    <ChevronDown
                      className="h-4 w-4 transition-transform"
                      style={{ color: colors.text }}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-2 ml-1 overflow-hidden">
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
                              "w-full px-3 py-2 rounded-md text-sm transition-colors active:bg-violet-600",
                              isActive
                                ? "font-semibold bg-orange-300"
                                : "hover:bg-[#28323f]"
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
