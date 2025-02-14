import { Navbar } from "@/components/reusable/navbar";
import React from "react";
// import { cookies } from "next/headers";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  // const cookieStore = cookies();
  // const token = (await cookieStore).get("session")?.value;

  return (
    <div className="flex h-screen flex-1 flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

export default RootLayout;
