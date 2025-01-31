"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Adjust the import according to your project structure

export function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle the search input on small screens
  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
  };

  // Close the search input when it loses focus
  const handleBlur = () => {
    setIsExpanded(false);
  };

  return (
    <div className="w-full flex-1 md:w-auto md:flex-none ml-4">
      {/* Search for larger screens (always visible) */}
      <div className="relative hidden xl:flex">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="pl-8 xl:w-[200px] 2xl:w-[250px]"
        />
      </div>

      {/* Search for small screens (icon + expandable input) */}
      <div className="xl:hidden flex items-center">
        {isExpanded ? (
          <div className="relative flex items-center transition-all duration-300 ease-in-out">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className={cn(
                "pl-8 pr-8 transition-all duration-300 ease-in-out",
                isExpanded ? "w-[200px] opacity-100" : "w-0 opacity-0"
              )}
              autoFocus
              onBlur={handleBlur} // Close when input loses focus
            />
          </div>
        ) : (
          <button
            onClick={toggleSearch}
            aria-label="Search"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
