"use client";

import React, { useEffect, useRef } from "react";

interface AppLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = "xs" }) => {
  const unknownLineLeftRef = useRef<HTMLDivElement>(null);
  const unknownLineRightRef = useRef<HTMLDivElement>(null);
  const awakeningLineRef = useRef<HTMLDivElement>(null);

  // Define scaling based on the size prop
  const scale = {
    xs: 1,
    sm: 1.75,
    md: 2.5,
    lg: 3,
    xl: 5,
  }[size];

  useEffect(() => {
    const unknownLineLeft = unknownLineLeftRef.current;
    const unknownLineRight = unknownLineRightRef.current;
    const awakeningLine = awakeningLineRef.current;

    if (unknownLineLeft && unknownLineRight && awakeningLine) {
      // Animate the left line beside "UNKNOWN" to move left
      unknownLineLeft.style.transition = "width 2s ease-in-out";
      unknownLineLeft.style.width = "100%";

      // Animate the right line beside "UNKNOWN" to move right
      unknownLineRight.style.transition = "width 2s ease-in-out";
      unknownLineRight.style.width = "100%";

      // Animate the line below "AWAKENING" to expand from the middle
      awakeningLine.style.transition =
        "width 2s ease-in-out, left 2s ease-in-out";
      awakeningLine.style.width = "80%";
    }
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center text-white font-audiowide"
      style={{ transform: `scale(${scale})` }} // Apply scaling
    >
      {/* UNKNOWN with stylized lines */}
      <div className="relative flex items-center">
        {/* Left stylized line */}
        <div
          ref={unknownLineLeftRef}
          className="absolute right-16 h-[1px] bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient"
          style={{
            width: "0%",
            clipPath: "polygon(100% 0, 70% 50%, 100% 100%)",
          }}
        />
        <span className="text-[9px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient hover:from-pink-600 hover:to-purple-400 transition-all duration-300 p-1">
          UNKNOWN
        </span>
        {/* Right stylized line */}
        <div
          ref={unknownLineRightRef}
          className="absolute left-16 h-[1px] bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient"
          style={{
            width: "0%",
            clipPath: "polygon(0 0, 30% 50%, 0 100%)",
          }}
        />
      </div>

      {/* AWAKENING with stylized line below */}
      <div className="relative -mt-3">
        <span className="text-[19px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient hover:from-pink-600 hover:to-purple-400 transition-all duration-300 p-1">
          PROJECT
        </span>
        {/* Stylized line below */}
        <div
          ref={awakeningLineRef}
          className="absolute -bottom-[2px] h-1 bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient"
          style={{
            width: "0%",
            left: "50%", // Start from the middle
            transform: "translateX(-50%)", // Center the line
            clipPath: "polygon(0 0, 100% 0, 90% 30%, 10% 30%)",
          }}
        />
      </div>
    </div>
  );
};
