import { Bell } from "lucide-react";
import { SearchBox } from "@/components/header/search-box";
import { ThemeToggle } from "@/components/header/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "../ui/button";
import { BreadCrumb } from "@/app/_components/breadcrumb";
import { SidebarToggle } from "./sidebar-toggle";
import { FullScreenToggle } from "./fullscreen-toggle";
import { RelatedApps } from "./related-apps";

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-14 items-center gap-4 px-8">
        <SidebarToggle />
        <BreadCrumb />
        <SearchBox />
        <div className="-mr-2 ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <FullScreenToggle />
          <RelatedApps />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
