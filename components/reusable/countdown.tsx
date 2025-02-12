"use client";

import { useState, useEffect } from "react";

interface ExpirationCountdownProps {
  expiration: number | undefined; // milliseconds
}

export const ExpirationCountdown = ({
  expiration,
}: ExpirationCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiration) return;

    const calculateTimeLeft = () => {
      const difference = expiration - Date.now(); // using Date.now() for current time in ms
      if (difference > 0) {
        setTimeLeft(Math.floor(difference / 1000));
      } else {
        setTimeLeft(0);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiration]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formattedTime = () => {
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  };

  return <span className="font-mono text-sm  ml-2">{formattedTime()}</span>;
};

interface ResendCodeCountdownProps {
  initialCount: number; // seconds
  onComplete: () => void;
}

export const ResendCodeCountdown = ({
  initialCount,
  onComplete,
}: ResendCodeCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // Start with `null` to avoid SSR mismatch

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure client-side execution

    const now = Math.floor(Date.now() / 1000);
    const storedEndTime = localStorage.getItem("resendCodeEndTime");
    let endTime: number;

    if (storedEndTime) {
      endTime = parseInt(storedEndTime);
    } else {
      endTime = now + initialCount;
      localStorage.setItem("resendCodeEndTime", endTime.toString());
    }

    const updateCountdown = () => {
      const remainingTime = Math.max(
        endTime - Math.floor(Date.now() / 1000),
        0,
      );
      setTimeLeft(remainingTime);

      if (remainingTime === 0) {
        localStorage.removeItem("resendCodeEndTime");
        onComplete();
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [initialCount, onComplete]);

  if (timeLeft === null) {
    return <p>Loading...</p>; // Prevent SSR mismatch by rendering placeholder first
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <p>
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </p>
  );
};
