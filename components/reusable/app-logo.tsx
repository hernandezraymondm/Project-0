import Link from "next/link";
import React from "react";

interface AppLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = "xs" }) => {
  // Define scaling based on the size prop
  const scale = {
    xs: "scale(1)",
    sm: "scale(1.5)",
    md: "scale(3)",
    lg: "scale(4)",
    xl: "scale(10)",
  }[size];

  return (
    <Link href="/">
      <div
        className="mx-auto flex select-none flex-col items-center justify-center font-audiowide text-white"
        style={{ transform: scale }} // Apply scaling
      >
        {/* UNKNOWN with stylized lines */}
        <div className="relative flex items-center">
          {/* Left stylized line */}
          <div className="animate-line-expand-left absolute right-[51px] h-[1px] bg-gradient-to-r from-purple-600 to-violet-600" />

          <span className="animate-gradient bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text p-1 text-[10px] font-bold text-transparent transition-all duration-300 hover:from-pink-600 hover:to-purple-400">
            NEXTJS
          </span>
          {/* Right stylized line */}
          <div className="animate-line-expand-right absolute left-[51px] h-[1px] bg-gradient-to-r from-violet-600 to-purple-600" />
        </div>

        {/* AWAKENING with stylized line below */}
        <div className="relative -mt-3">
          <span className="animate-gradient bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text p-1 text-[19px] font-bold text-transparent transition-all duration-300 hover:from-pink-600 hover:to-purple-400">
            STARTER
          </span>
          {/* Stylized line below */}
          <div className="animate-line-expand-center absolute -bottom-[1px] h-1 bg-gradient-to-r from-purple-600 to-violet-600" />
        </div>
      </div>
    </Link>
  );
};
