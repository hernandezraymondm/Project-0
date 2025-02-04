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
import { useSidebar } from "@/components/ui/sidebar"; // Import useSidebar hook

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
  const { state } = useSidebar(); // Get the sidebar state (expanded/collapsed)

  return (
    <Sidebar
      className={cn(
        "z-50 w-64 border-r transition-all duration-300 ease-in-out",
        state === "collapsed" && "w-16", // Smaller width when collapsed
      )}
      id="sidebar"
    >
      <SidebarHeader className="bg-accent-primary border-b border-[#6a5b83] px-6">
        <Link href="/" className="flex items-center">
          <AppLogo />
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-accent-primary px-3 py-5">
        <SidebarMenu className="space-y-2">
          {modules.map((module) => (
            <SidebarMenuItem key={module.name}>
              <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={cn(
                      "wiggle-on-hover w-full justify-between rounded-lg py-3 text-gray-400 transition-colors hover:text-white",
                      state === "collapsed" && "justify-center px-2", // Center content and reduce padding when collapsed
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="wiggle-icon drop-shadow-lg">
                        <module.icon
                          className="h-5 w-5 transition-transform duration-300"
                          style={{ color: module.color }}
                        />
                      </div>
                      {/* Hide text when sidebar is collapsed */}
                      {state === "expanded" && (
                        <span className="font-semibold drop-shadow-lg">
                          {module.name}
                        </span>
                      )}
                    </div>
                    {/* Hide chevron when sidebar is collapsed */}
                    {state === "expanded" && (
                      <ChevronDown
                        className="h-4 w-4 transition-transform"
                        style={{ color: colors.text }}
                      />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* Adjust submenu for collapsed state */}
                <CollapsibleContent className="ml-1 mt-2 overflow-hidden">
                  <SidebarMenuSub
                    className={cn(
                      "space-y-1 border-l-2 pl-4",
                      state === "collapsed" && "pl-2", // Reduce padding when collapsed
                    )}
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
                              "w-full rounded-md px-3 py-2 text-sm transition-colors active:bg-violet-600",
                              isActive
                                ? "bg-orange-300 font-semibold"
                                : "hover:bg-[#28323f]",
                            )}
                            style={{
                              color: isActive ? colors.primary : colors.text,
                            }}
                          >
                            <Link href={href}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: module.color }}
                                />
                                {/* Hide submenu text when sidebar is collapsed */}
                                {state === "expanded" && <span>{page}</span>}
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
