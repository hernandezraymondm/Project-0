"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  const actions = [
    {
      label: "Change Password",
      action: () => alert("Change Password Clicked"),
    },
    { label: "Update Profile", action: () => alert("Update Profile Clicked") },
    {
      label: "View Audit Logs",
      action: () => alert("View Audit Logs Clicked"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action, index) => (
          <Button key={index} onClick={action.action} className="button w-full">
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
