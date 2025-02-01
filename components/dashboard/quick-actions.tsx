"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function QuickActions() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { toast } = useToast();

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
    <Card className="card">
      <CardHeader>
        <CardTitle className="card-title">Quick Actions</CardTitle>
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
