"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CalendarDays, Clock } from "lucide-react";

interface DateTimeDisplayProps {
  showSeconds?: boolean;
}

export function DateTimeDisplay({ showSeconds = false }: DateTimeDisplayProps) {
  const [dateTime, setDateTime] = useState(new Date());

  const updateDateTime = useCallback(() => {
    setDateTime(new Date());
  }, []);

  useEffect(() => {
    updateDateTime();
    const intervalMs = showSeconds ? 1000 : 60000;
    const timer = setInterval(updateDateTime, intervalMs);

    return () => clearInterval(timer);
  }, [showSeconds, updateDateTime]);

  const formatDate = useMemo(() => {
    return (date: Date) =>
      date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
  }, []);

  const formatTime = useMemo(() => {
    return (date: Date) =>
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: showSeconds ? "2-digit" : undefined,
        hour12: true,
      });
  }, [showSeconds]);

  return (
    <div className="flex items-center justify-between gap-7 text-sm text-primary/75">
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4" strokeWidth={3} />
        <span>{formatTime(dateTime)}</span>
      </div>
      <div className="flex items-center space-x-2">
        <CalendarDays className="h-4 w-4" strokeWidth={3} />
        <span>{formatDate(dateTime)}</span>
      </div>
    </div>
  );
}
