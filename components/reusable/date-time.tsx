"use client";

import { useState, useEffect, useCallback } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns";

interface ClientDateTimeDisplayProps {
  showSeconds?: boolean;
  type: "time" | "date";
}

export function ClientDateTimeDisplay({
  showSeconds = false,
  type,
}: ClientDateTimeDisplayProps) {
  const [dateTime, setDateTime] = useState<Date | null>(null);

  const updateDateTime = useCallback(() => {
    setDateTime(new Date());
  }, []);

  useEffect(() => {
    updateDateTime();
    const intervalMs = showSeconds ? 1000 : 60000;
    const timer = setInterval(updateDateTime, intervalMs);

    return () => clearInterval(timer);
  }, [showSeconds, updateDateTime]);

  if (!dateTime) {
    return (
      <ScaleLoader
        color="hsl(var(--tertiary))"
        height={15}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );
  }

  if (type === "time") {
    return (
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4" strokeWidth={3} />
        <span className="w-24">
          {format(dateTime, showSeconds ? "hh:mm:ss a" : "hh:mm a")}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <CalendarDays className="h-4 w-4" strokeWidth={3} />
      <span>{format(dateTime, "MMMM dd, yyyy")}</span>
    </div>
  );
}
