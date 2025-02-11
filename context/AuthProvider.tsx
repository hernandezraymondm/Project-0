"use client";

import {
  login as loginService,
  logout as logoutService,
  refreshAccessToken as refreshAccessTokenService,
  register as registerService,
  fetchUser as fetchUserService,
} from "@/services/auth.service";
import { useState, useEffect, useCallback, createContext } from "react";
import { AuthContextType } from "@/lib/types/auth.types";
import { CustomError } from "@/lib/types/error.types";
import { User } from "@/lib/types/user.types";
import { Config } from "@/config/app.config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string, code?: string) => {
    try {
      const response = await loginService({ email, password, code });
      const data = await response.json();

      if (response.ok && data.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken);
        await fetchUser(data.accessToken);
        toast.success("You have been logged in successfully.");
        router.push("/dashboard");
        router.refresh();
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
        toast.info("Please check your email to verify your account.");
        router.refresh();
        return data;
      }
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await logoutService();
      if (response.ok) {
        sessionStorage.removeItem("accessToken");
        setUser(null);
        toast.success("You have been successfully logged out.");
        router.push("/auth/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const refreshAccessToken = useCallback(async () => {
    try {
      const { accessToken } = await refreshAccessTokenService();
      if (accessToken) {
        sessionStorage.setItem("accessToken", accessToken);
        return accessToken;
      }
      return null;
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    }
  }, []);

  const handleApiError = useCallback(
    async (error: any) => {
      if (error.response && error.response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return newToken;
        } else {
          sessionStorage.removeItem("accessToken");
          setUser(null);
          router.push("/login");
        }
      }
      return null;
    },
    [router, refreshAccessToken],
  );

  const fetchUser = useCallback(
    async (token?: string) => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUserService(token);
        setUser(userData);
      } catch (error: unknown) {
        const err = error as CustomError;
        if (
          err.message === "Fetching user failed" &&
          err.response &&
          err.response.status === 401
        ) {
          const newToken = await handleApiError({ response: err.response });
          if (newToken) {
            await fetchUser(newToken);
          }
        }
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    },
    [handleApiError],
  );

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }

    const refreshTokenPeriodically = setInterval(async () => {
      const currentToken = sessionStorage.getItem("accessToken");
      if (currentToken) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          await fetchUser(newToken);
        }
      }
    }, Config.TOKEN_REFRESH_INTERVAL);

    return () => clearInterval(refreshTokenPeriodically);
  }, [fetchUser, refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshAccessToken,
        register,
        loading,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
