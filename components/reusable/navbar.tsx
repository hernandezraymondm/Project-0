"use client";

import {
  Bell,
  Maximize,
  Minimize,
  LayoutGrid,
  SquareDashedMousePointer,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BreadCrumb } from "@/app/(protected)/_components/breadcrumb";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { LogoutButton } from "@/components/reusable/logout-button";
import { ThemeToggle } from "@/components/header/theme-toggle";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";

export function Navbar() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Related Applications Data
  const relatedApplications = [
    {
      name: "Facebook Page",
      icon: <FaFacebookF className="h-6 w-6" />,
      color: "text-blue-500",
      link: "/dashboard/home",
    },
    {
      name: "Instagram Page",
      icon: <FaInstagram className="h-6 w-6" />,
      color: "text-pink-500",
      link: "/dashboard/home",
    },
    {
      name: "Tiktok Page",
      icon: <FaTiktok className="h-6 w-6" />,
      color: "text-black",
      link: "/dashboard/home",
    },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#1e293b] bg-transparent">
      <div className="flex h-14 items-center gap-4 px-8">
        <BreadCrumb />
        <div className="-mr-2 ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </Button>
          {/* Related Applications Popover */}
          <Popover>
            <PopoverTrigger asChild className="h-9 w-9">
              <Button variant="ghost" className="icon">
                <LayoutGrid className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-3 p-4">
              <div className="flex items-center gap-3">
                <SquareDashedMousePointer />
                Related Applications
              </div>
              <div className="grid grid-cols-3 gap-3">
                {relatedApplications.map((app, index) => (
                  <a
                    key={index}
                    href={app.link}
                    className="flex flex-col items-center justify-center rounded-lg border bg-accent/60 p-3 text-center transition-colors hover:bg-accent"
                  >
                    <div className={app.color}>{app.icon}</div>
                    <span className="mt-2 text-xs">{app.name}</span>
                  </a>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
