"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function LogoutButton() {
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // This is important for including cookies in the request
      });
      if (response.ok) {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        router.push("/login");
        router.refresh();
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button variant="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
}
