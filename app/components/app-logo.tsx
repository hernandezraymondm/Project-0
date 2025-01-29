import React from "react";

interface AppLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = "xs" }) => {
  // Define scaling based on the size prop
  const scale = {
    xs: "scale(1)",
    sm: "scale(2)",
    md: "scale(3)",
    lg: "scale(4)",
    xl: "scale(5)",
  }[size];

  return (
    <div
      className="flex flex-col items-center justify-center text-white font-audiowide select-none"
      style={{ transform: scale }} // Apply scaling
    >
      {/* UNKNOWN with stylized lines */}
      <div className="relative flex items-center">
        {/* Left stylized line */}
        <div className="absolute right-[61px] h-[1px] bg-gradient-to-r from-pink-600 to-purple-400 animate-line-expand-left" />
        <span className="text-[9px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient hover:from-pink-600 hover:to-purple-400 transition-all duration-300 p-1">
          UNKNOWN
        </span>
        {/* Right stylized line */}
        <div className="absolute left-[61px] h-[1px] bg-gradient-to-r from-pink-600 to-purple-400 animate-line-expand-right" />
      </div>

      {/* AWAKENING with stylized line below */}
      <div className="relative -mt-3">
        <span className="text-[19px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient hover:from-pink-600 hover:to-purple-400 transition-all duration-300 p-1">
          PROJECT
        </span>
        {/* Stylized line below */}
        <div className="absolute -bottom-[2px] h-1 bg-gradient-to-r from-purple-400 to-pink-600 animate-line-expand-center" />
      </div>
    </div>
  );
};
