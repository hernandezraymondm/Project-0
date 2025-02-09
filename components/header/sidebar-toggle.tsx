"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

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
