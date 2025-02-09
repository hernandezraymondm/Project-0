"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { OutlineInput } from "../ui/outline-input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import QRCode from "qrcode";

export function Setup2FA() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [secret, setSecret] = useState("");
  const [otpauth, setOtpauth] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    fetch("/api/auth/2fa-status")
      .then((res) => res.json())
      .then((data) => setIs2FAEnabled(data.enabled))
      .catch((error) => console.error("Error fetching 2FA status:", error));
  }, []);

  const enable2FA = async () => {
    try {
      const response = await fetch("/api/auth/enable-2fa", { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setSecret(data.secret);
        setOtpauth(data.otpauth);
        const qr = await QRCode.toDataURL(data.otpauth);
        setQrCode(qr);
      } else {
        toast.error(data.error || "An error occurred while enabling 2FA");
      }
    } catch (error) {
      console.error("Enable 2FA error:", error);
      toast.error("An error occurred while enabling 2FA");
    }
  };

  const verify2FA = async () => {
    try {
      const response = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (response.ok) {
        setIs2FAEnabled(true);
        setSecret("");
        setOtpauth("");
        setQrCode("");
        setToken("");
        toast.success("2FA has been enabled for your account");
      } else {
        toast.error(data.error || "An error occurred while verifying 2FA");
      }
    } catch (error) {
      console.error("Verify 2FA error:", error);
      toast.error("An error occurred while verifying 2FA");
    }
  };

  const disable2FA = async () => {
    try {
      const response = await fetch("/api/auth/disable-2fa", { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setIs2FAEnabled(false);
        toast.success("2FA has been disabled for your account");
      } else {
        toast.error(data.error || "An error occurred while disabling 2FA");
      }
    } catch (error) {
      console.error("Disable 2FA error:", error);
      toast.error("An error occurred while disabling 2FA");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
      </CardHeader>
      {is2FAEnabled ? (
        <CardContent>
          <p className="mb-5 text-sm">
            2FA is currently enabled for your account.
          </p>
          <Button onClick={disable2FA} variant="destructive">
            Disable 2FA
          </Button>
        </CardContent>
      ) : !secret ? (
        <CardContent>
          <p className="mb-5 text-sm">
            2FA is currently disabled. Enable it to add an extra layer of
            security to your account.
          </p>
          <Button onClick={enable2FA} className="button">
            Enable 2FA
          </Button>
        </CardContent>
      ) : (
        <CardContent className="flex flex-col space-y-4">
          <p className="text-sm">
            Scan this QR code with your authenticator app:
          </p>
          <Image
            width={256}
            height={256}
            src={qrCode || "/placeholder.svg"}
            alt="2FA QR Code"
            className="mx-auto h-64 w-64"
          />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="self-center bg-success text-xs hover:bg-success/80"
          >
            <Link
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&pli=1"
              target="_blank"
              className="flex items-center justify-center gap-2"
            >
              <Download /> Download Google Authenticator
            </Link>
          </Button>

          <p className="break-words text-sm text-gray-500">
            If you can&apos;t scan the QR code, you can manually enter this
            secret key in your authenticator app:
          </p>
          <p className="text-sm font-semibold text-violet-400">{secret}</p>

          <p className="break-words text-sm text-gray-500">
            Or enter this URL manually:
          </p>
          <p className="break-all text-xs text-gray-500">{otpauth}</p>

          <OutlineInput
            label="Enter 6-digit code"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="rounded-3xl bg-background focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
          />
          <Button onClick={verify2FA} className="button w-full">
            Verify and Enable
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
