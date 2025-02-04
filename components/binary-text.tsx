"use client";

import { useState, useEffect } from "react";

export function BinaryText() {
  const [binaryArray, setBinaryArray] = useState<
    { value: string; color: string }[]
  >([]);

  // Function to generate random binary text with color variations
  const generateBinaryArray = (length = 5000) => {
    return Array.from({ length }, () => {
      const value = Math.random() > 0.5 ? "1" : "0";
      const random = Math.random();
      let color = "text-gray-700"; // Default gray

      if (random < 0.05)
        color = "text-pink-400"; // 5% chance to be pink
      else if (random < 0.1) color = "text-purple-400"; // 5% chance to be purple

      return { value, color };
    });
  };

  useEffect(() => {
    setBinaryArray(generateBinaryArray());

    const interval = setInterval(() => {
      setBinaryArray(generateBinaryArray());
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-crawl-container select-none opacity-40">
      <div className="fade-overlay"></div>

      <div className="crawl">
        <div className="crawl-content">
          <div className="crawl-text font-mono text-2xl tracking-widest">
            <p className="mb-8 break-words leading-tight">
              {binaryArray.map((item, index) => (
                <span key={index} className={item.color}>
                  {item.value}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
