"use client";

import {
  login as loginService,
  logout as logoutService,
  refreshAccessToken as refreshAccessTokenService,
  register as registerService,
  fetchSession as fetchSessionService,
} from "@/services/auth.service";
import {
  useState,
  useEffect,
  useCallback,
  createContext,
  type ReactNode,
} from "react";
import type { AuthContextType } from "@/lib/types/auth.types";
import type { Session } from "@/lib/types/session.types";
import { Config } from "@/config/app.config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string, code?: string) => {
    try {
      const response = await loginService({ email, password, code });
      const data = await response.json();

      if (response.ok && data.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken);
        await fetchUser(data.accessToken);
        router.push("/dashboard");
        router.refresh();
        toast.success("You're all set! Enjoy your session.");
        return data;
      }
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    try {
      const response = await registerService({
        name,
        email,
        password,
        confirmPassword,
      });

      const data = await response.json();
      if (response.ok) {
        router.refresh();
        toast.info("Please check your email to verify your account.");
        return data;
      }
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    const token = sessionStorage.getItem("accessToken");
    await logoutService(token);
    sessionStorage.removeItem("accessToken");
    setSession(null);
    router.push("/auth/login");
  }, [router]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await refreshAccessTokenService();
      if (!response.ok) throw new Error();
      const { accessToken } = await response.json();
      sessionStorage.setItem("accessToken", accessToken);
      return accessToken;
    } catch {
      await logout();
      return null;
    }
  }, [logout]);

  const fetchUser = useCallback(
    async (token?: string, retryCount = 3) => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetchSessionService(token);
        if (!response.ok) throw new Error();
        const session = await response.json();
        setSession(session);
      } catch {
        if (retryCount > 0) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            await fetchUser(newToken, retryCount - 1);
          }
        } else {
          toast.error(
            "Failed to fetch user data. Please try logging in again.",
          );
          await logout();
        }
      } finally {
        setLoading(false);
      }
    },
    [refreshAccessToken, logout],
  );

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    fetchUser(token ?? undefined);

    const interval = setInterval(async () => {
      if (sessionStorage.getItem("accessToken")) {
        await refreshAccessToken();
      }
    }, Config.TOKEN_REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
      sessionStorage.removeItem("accessToken");
    };
  }, [fetchUser, refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        logout,
        refreshAccessToken,
        register,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
