"use client";

import {
  login as loginService,
  logout as logoutService,
  refreshAccessToken as refreshAccessTokenService,
  register as registerService,
  fetchSession as fetchSessionService,
} from "@/services/auth.service";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

function getAccessToken() {
  return sessionStorage.getItem("accessToken");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string, code?: string) => {
    try {
      const response = await loginService({ email, password, code });
      const data = await response.json();

      if (response.ok && data.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken);
        await fetchSession(data.accessToken);
        router.push("/home");
        router.refresh();
        toast.success("Welcome back! Enjoy your session.");
        return data;
      }
      return data;
    } catch (error) {
      console.error("LOGIN ERROR:", error);
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
      console.error("REGISTRATION ERROR:", error);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      const token = getAccessToken();
      await logoutService(token);
      sessionStorage.removeItem("accessToken");
      setSession(null);
      setTimeout(() => {
        router.push("/login");
        setIsLoggingOut(false);
      }, 1000);
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  }, [router]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await refreshAccessTokenService();
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`FAILED TO REFRESH ACCESS TOKEN: ${data.error}`);
      }
      sessionStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error("ACCESS TOKEN REFRESH ERROR:", error);
      await logout();
      return null;
    }
  }, [logout]);

  const fetchSession = useCallback(
    async (token?: string, retryCount = 3) => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        sessionStorage.setItem("accessToken", token);
        const response = await fetchSessionService(token);
        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(`FAILED TO FETCH SESSION: ${error}`);
        }
        const session = await response.json();
        setSession(session);
      } catch (error: any) {
        console.error("FETCH SESSION ERROR:", error);
        if (retryCount > 0) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            await fetchSession(newToken, retryCount - 1);
          }
        } else {
          toast.error(`FAILED TO FETCH SESSION DATA: ${error.message}`);
          await logout();
        }
      } finally {
        setLoading(false);
      }
    },
    [refreshAccessToken, logout],
  );

  useEffect(() => {
    const token = getAccessToken();
    fetchSession(token ?? undefined);

    const interval = setInterval(async () => {
      if (getAccessToken()) {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error("INTERVAL REFRESH ERROR:", error);
        }
      }
    }, Config.TOKEN_REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
      sessionStorage.removeItem("accessToken");
    };
  }, [fetchSession, refreshAccessToken]);

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
      <AlertDialog open={isLoggingOut}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logging Out</AlertDialogTitle>
            <AlertDialogDescription>
              Logging out your account, please wait...
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </AuthContext.Provider>
  );
}
