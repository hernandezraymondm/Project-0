import React from "react";
import { cookies } from "next/headers";
import Navbar from "@/components/navbar";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;

  return (
    <div>
      <Navbar token={token} />
      {children}
    </div>
  );
};

export default RootLayout;
