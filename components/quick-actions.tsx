"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function QuickActions() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { toast } = useToast();

  const actions = [
    {
      label: "Change Password",
      action: () => alert("Change Password Clicked"),
    },
    { label: "Update Profile", action: () => alert("Update Profile Clicked") },
    { label: "View Logs", action: () => alert("View Logs Clicked") },
  ];

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-pink-400 mb-6">Quick Actions</h2>
      <div className="space-y-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.action}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
