"use client";

import { useToast } from "@/hooks/use-toast";

export function SecurityOverview() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { toast } = useToast();

  const securityData = [
    { label: "Email Verified", value: "Yes" },
    { label: "2FA Enabled", value: "No" },
    { label: "Last Login", value: "2023-10-15 14:30" },
  ];

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-400 mb-6">
        Security Overview
      </h2>
      <div className="space-y-4">
        {securityData.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <p className="text-gray-300">{item.label}</p>
            <p className="text-white font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
