import { ThemeToggle } from "@/components/header/theme-toggle";
import { FullScreenToggle } from "../header/fullscreen-toggle";
import { RelatedApps } from "../header/related-apps";
import { AppLogo } from "./app-logo";

export function Navbar() {
  return (
    <header className="fixed top-0 w-full border-b border-[#1e293b] bg-transparent text-white z-10">
      <div className="flex h-14 items-center gap-4 px-8">
        <AppLogo size="xs" />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <FullScreenToggle />
          <RelatedApps />
        </div>
      </div>
    </header>
  );
}
