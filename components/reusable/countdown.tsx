"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  expiration: number | undefined; // milliseconds
  onComplete?: () => void;
}

export const Countdown = ({ expiration, onComplete }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiration) return;

    const calculateTimeLeft = () => {
      const difference = expiration - Date.now(); // using Date.now() for current time in ms
      if (difference > 0) {
        setTimeLeft(Math.floor(difference / 1000));
      } else {
        setTimeLeft(0);
        if (onComplete) onComplete(); // CALL onComplete WHEN TIME HITS 0
        clearInterval(timer); // CLEAR THE INTERVAL TO STOP THE COUNTDOWN
      }
    };

    calculateTimeLeft(); // INITIAL CALL TO SET THE TIME LEFT
    const timer = setInterval(calculateTimeLeft, 1000); // UPDATE EVERY SECOND

    return () => clearInterval(timer); // CLEANUP INTERVAL ON COMPONENT UNMOUNT
  }, [expiration, onComplete]); // ADD onComplete TO DEPENDENCY ARRAY

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

  return <span className="font-mono text-sm ml-2">{formattedTime()}</span>;
};
