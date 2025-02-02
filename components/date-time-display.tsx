"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns";
import ScaleLoader from "react-spinners/ScaleLoader";

interface DateTimeDisplayProps {
  showSeconds?: boolean;
}

export function DateTimeDisplay({ showSeconds = false }: DateTimeDisplayProps) {
  const [dateTime, setDateTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false); // Track if the component is on the client

  const updateDateTime = useCallback(() => {
    setDateTime(new Date());
  }, []);

  useEffect(() => {
    setIsMounted(true); // Set setIsMounted to true after hydration
    updateDateTime();
    const intervalMs = showSeconds ? 1000 : 60000;
    const timer = setInterval(updateDateTime, intervalMs);

    return () => clearInterval(timer);
  }, [showSeconds, updateDateTime]);

  // Render a placeholder on the server
  if (!isMounted) {
    return (
      <div className="hidden lg:flex items-center justify-between gap-6 text-sm text-muted-foreground flex-nowrap text-nowrap">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" strokeWidth={3} />
          <ScaleLoader
            color="hsl(var(--primary))"
            height={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-4 w-4" strokeWidth={3} />
          <ScaleLoader
            color="hsl(var(--primary))"
            height={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center justify-between gap-6 text-sm text-muted-foreground flex-nowrap text-nowrap">
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4" strokeWidth={3} />
        <span className="w-24">
          {format(dateTime, showSeconds ? "hh:mm:ss a" : "hh:mm a")}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <CalendarDays className="h-4 w-4" strokeWidth={3} />
        <span>{format(dateTime, "MMMM dd, yyyy")}</span>
      </div>
    </div>
  );
}
