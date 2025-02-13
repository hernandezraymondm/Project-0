import { LogoutButton } from "@/components/reusable/logout-button";
import { ThemeToggle } from "@/components/header/theme-toggle";
import { BreadCrumb } from "@/components/header/breadcrumb";
import { SearchBox } from "@/components/header/search-box";
import { FullScreenToggle } from "./fullscreen-toggle";
import { SidebarToggle } from "./sidebar-toggle";
import { RelatedApps } from "./related-apps";
import { headers } from "next/headers";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";

export async function Header() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isProtected = pathname.startsWith("/home");

  if (!isProtected) {
    return null;
  }
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
