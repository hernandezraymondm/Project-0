"use client";

import { Bell, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { BreadCrumb } from "@/app/components/breadcrumb";
import { DateTimeDisplay } from "@/components/dashboard/date-time-display";
import { SearchBar } from "../header/search-box";
import { LogoutButton } from "../logout-button";
import { Separator } from "../ui/separator";

export function DashboardNavbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-navbar sticky top-0 flex w-full justify-end border-b border-border lg:inline-block">
      <div className="flex h-14 items-center justify-between px-12">
        <div className="mr-4 hidden xl:flex">
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="mr-6 items-center space-x-2 font-bold">
            <BreadCrumb />
          </span>
        </div>
        <DateTimeDisplay />
        <div className="flex items-center justify-between space-x-2 md:justify-end">
          <SearchBar />
          <nav className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-primary"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="User menu"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
