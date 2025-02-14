import { getCookie } from "@/lib/utils/cookie";
import { useState, useEffect } from "react";

export const useCountdownTimer = (expiresAt?: number, storageKey?: string) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt && !storageKey) return;

    let expiryTime = expiresAt;

    // Retrieve from cookie if storageKey exists
    if (storageKey && typeof window !== "undefined") {
      const storedTime = getCookie(storageKey);
      if (storedTime) {
        expiryTime = Number(storedTime);
      }
    }

    const updateCountdown = () => {
      if (!expiryTime) return;
      const remaining = Math.max(
        0,
        Math.floor((expiryTime - Date.now()) / 1000),
      );
      setTimeLeft(remaining);
    };

    updateCountdown(); // Set initial value
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, storageKey]);

  const isExpired = timeLeft <= 0;

  const formattedTime = () => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return { timeLeft, formattedTime: formattedTime(), isExpired };
};
