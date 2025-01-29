"use client";

import { formatDateTime } from "@/lib/utils";
import { useEffect, useState } from "react";

export function SecurityOverview() {
  const [user, setUser] = useState<{
    isEmailVerified: boolean;
    twoFactorEnabled: boolean;
    lastLogin: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/user/get-user")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const securityData = [
    { label: "Email Verified", value: user?.isEmailVerified ? "Yes" : "No" },
    { label: "2FA Enabled", value: user?.twoFactorEnabled ? "Yes" : "No" },
    {
      label: "Last Login",
      value: user?.lastLogin ? formatDateTime(user.lastLogin) : "N/A",
    },
  ];

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-400 mb-6 font-jura">
        Security Overview
      </h2>
      <div className="space-y-4">
        {securityData.map((item, index) => (
          <div key={index} className="flex justify-between items-start gap-2">
            <p className="text-gray-300 text-nowrap">{item.label}</p>
            <p className="text-white font-semibold text-right">
              {item.value || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
