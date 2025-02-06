"use client";

import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export const SidebarToggle = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={toggleSidebar}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
};
