import { BreadCrumb } from "@/app/(protected)/_components/breadcrumb";
import { LogoutButton } from "@/components/reusable/logout-button";
import { ThemeToggle } from "@/components/header/theme-toggle";
import { SearchBox } from "@/components/header/search-box";
import { FullScreenToggle } from "./fullscreen-toggle";
import { SidebarToggle } from "./sidebar-toggle";
import { RelatedApps } from "./related-apps";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";

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
