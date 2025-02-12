import { Navbar } from "@/components/reusable/navbar";
import React from "react";
// import { cookies } from "next/headers";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  // const cookieStore = cookies();
  // const token = (await cookieStore).get("session")?.value;

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default RootLayout;
