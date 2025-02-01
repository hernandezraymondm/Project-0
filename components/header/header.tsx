"use client";

import { Menu, Bell, Github } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { SearchBar } from "@/components/header/search-bar";
import { ThemeToggle } from "@/components/header/theme-toggle";
import { HeaderUser } from "@/components/header/header-user";
import { Button } from "../ui/button";

export function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="border-b bg-card/50 rounded-b-xl">
      <div className="flex h-14 items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <SearchBar />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Github className="h-5 w-5" />
          </Button>
          <HeaderUser />
        </div>
      </div>
    </header>
  );
}
