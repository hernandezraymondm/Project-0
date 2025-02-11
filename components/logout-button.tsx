"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export function LogoutButton() {
  const { logout } = useAuth();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      try {
        await logout();
      } catch {
        toast.error("An error occurred during logout. Please try again.");
      }
    });
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={handleLogout}>
        <LogOut className="h-5 w-5" />
      </Button>

      <AlertDialog open={isPending}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logging Out</AlertDialogTitle>
            <AlertDialogDescription>
              Logging out your account, please wait...
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
