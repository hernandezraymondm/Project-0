"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export function Search() {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search (ctrl + k)"
        className="pl-8 md:w-[300px] lg:w-[400px]"
      />
    </div>
  );
}
