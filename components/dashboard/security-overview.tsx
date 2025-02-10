"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLastLogin } from "@/lib/utils/format-last-login";
import { useState, useEffect } from "react";

interface User {
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin: string;
}

export const SecurityOverview = () => {
  const [user, setUser] = useState<User | null>(null);
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/get-user");
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        setUser(data.user);
        setLog(data.user.lastLogin);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const securityData = [
    { label: "Email Verified", value: user?.isEmailVerified ? "Yes" : "No" },
    { label: "2FA Enabled", value: user?.twoFactorEnabled ? "Yes" : "No" },
    {
      label: "Last Login",
      value: log ? formatLastLogin(new Date(log)) : "N/A",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Overview</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[9.5em] space-y-4">
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : (
          securityData.map((item, index) => (
            <div
              key={index}
              className="flex items-start justify-between gap-2 text-sm"
            >
              <p className="text-nowrap">{item.label}</p>
              <p className="text-right">{item.value || "N/A"}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
