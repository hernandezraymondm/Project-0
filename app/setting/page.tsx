import React from "react";
import { AppLogo } from "../components/app-logo";
import { BinaryText } from "@/components/binary-text";

const SettingPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-space-800 to-black overflow-hidden">
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-500/20 via-transparent to-transparent animate-pulse"></div>

      <AppLogo size="xl" />
      <BinaryText />
      {/* Floating stars animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white rounded-full animate-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 5}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: `${Math.random() * 0.5 + 0.2}`, // Random opacity for subtlety
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SettingPage;
