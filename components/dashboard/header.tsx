"use client";

import { Menu, Bell, Github } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Search } from "@/components/dashboard/search";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { UserNav } from "@/components/dashboard/user-nav";
import { Button } from "../ui/button";

export function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="border-b bg-card/50">
      <div className="flex h-14 items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Search />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Github className="h-5 w-5" />
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
