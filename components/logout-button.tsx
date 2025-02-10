"use client";

// import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  // const router = useRouter();

  const handleLogout = async () => {
    signOut();
    // try {
    //   const response = await fetch("/api/auth/logout", {
    //     method: "POST",
    //     credentials: "include", // This is important for including cookies in the request
    //   });
    //   if (response.ok) {
    //     toast.success("You have been successfully logged out.");
    //     router.push("/auth/login");
    //     router.refresh();
    //   } else {
    //     throw new Error("Logout failed");
    //   }
    // } catch (error) {
    //   console.error("Logout error:", error);
    //   toast.error("An error occurred while logging out.");
    // }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleLogout}>
      <LogOut className="h-5 w-5" />
    </Button>
  );
}
