"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";

export function Setup2FA() {
  const { toast } = useToast();
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
        toast({
          title: "Error",
          description: data.error || "An error occurred while enabling 2FA",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Enable 2FA error:", error);
      toast({
        title: "Error",
        description: "An error occurred while enabling 2FA",
        variant: "destructive",
      });
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
        toast({
          title: "Success",
          description: "2FA has been enabled for your account",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "An error occurred while verifying 2FA",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Verify 2FA error:", error);
      toast({
        title: "Error",
        description: "An error occurred while verifying 2FA",
        variant: "destructive",
      });
    }
  };

  const disable2FA = async () => {
    try {
      const response = await fetch("/api/auth/disable-2fa", { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setIs2FAEnabled(false);
        toast({
          title: "Success",
          description: "2FA has been disabled for your account",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "An error occurred while disabling 2FA",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Disable 2FA error:", error);
      toast({
        title: "Error",
        description: "An error occurred while disabling 2FA",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="card">
      <CardHeader>
        <CardTitle className="card-title">Two-Factor Authentication</CardTitle>
      </CardHeader>
      {is2FAEnabled ? (
        <CardContent>
          <p className="mb-5 text-primary text-sm">
            2FA is currently enabled for your account.
          </p>
          <Button onClick={disable2FA} variant="destructive">
            Disable 2FA
          </Button>
        </CardContent>
      ) : !secret ? (
        <CardContent>
          <p className="mb-5 text-primary text-sm">
            2FA is currently disabled. Enable it to add an extra layer of
            security to your account.
          </p>
          <Button onClick={enable2FA} variant="secondary">
            Enable 2FA
          </Button>
        </CardContent>
      ) : (
        <CardContent className="space-y-4">
          <p className="text-primary text-sm">
            Scan this QR code with your authenticator app:
          </p>
          <Image
            width={256}
            height={256}
            src={qrCode || "/placeholder.svg"}
            alt="2FA QR Code"
            className="w-64 h-64 mx-auto"
          />
          <p className="text-sm text-gray-500 break-all">
            If you can&apos;t scan the QR code, you can manually enter this URL
            in your authenticator app:
          </p>
          <p className="text-xs text-gray-500 break-all">{otpauth}</p>
          <p className="text-primary break-words text-sm">
            Or enter this secret manually:{" "}
            <span className="text-violet-400 text-base">{secret}</span>
          </p>
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
          />
          <Button onClick={verify2FA} className="button w-full">
            Verify and Enable 2FA
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
