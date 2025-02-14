import { getCookie, setCooldownCookie } from "@/lib/utils/cookie";
import { useCountdownTimer } from "./use-countdown";
import { useState, useEffect } from "react";

interface UseResendEmailProps {
  prefixKey: string;
  email?: string | undefined;
}

export const useResendEmail = ({ prefixKey, email }: UseResendEmailProps) => {
  const storageKey = `${prefixKey}_${email}`;

  // Retrieve stored cooldown expiration time from cookies
  const getCooldownExpiration = () => {
    if (typeof window === "undefined") return null;
    const storedCooldown = getCookie(storageKey);
    return storedCooldown ? Number(storedCooldown) : null;
  };

  const [expiresAt, setExpiresAt] = useState<number | null>(
    getCooldownExpiration,
  );

  // Pass expiresAt to useCountdownTimer
  const { timeLeft, isExpired } = useCountdownTimer(
    expiresAt ?? undefined,
    storageKey,
  );

  // Reset when cooldown expires
  useEffect(() => {
    if (isExpired) {
      setExpiresAt(null);
    }
  }, [isExpired]);

  // Function to start the resend cooldown
  const startResendCooldown = (cooldownMs: number) => {
    const newExpiresAt = Date.now() + cooldownMs;
    setExpiresAt(newExpiresAt);
    setCooldownCookie(storageKey, newExpiresAt.toString(), cooldownMs);
  };

  return {
    onCooldown: !isExpired, // Cooldown is active if not expired
    timeLeft,
    startResendCooldown, // Call this in the component when API succeeds
  };
};
