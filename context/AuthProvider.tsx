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

// CREATE AUTH CONTEXT
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// AUTH PROVIDER COMPONENT
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true); // LOADING STATE
  const [user, setUser] = useState<User | null>(null); // USER STATE
  const router = useRouter(); // NEXT.JS ROUTER

  // LOGIN FUNCTION
  const login = async (email: string, password: string, code?: string) => {
    try {
      // CALL LOGIN SERVICE
      const response = await loginService({ email, password, code });
      const data = await response.json();

      // HANDLE SUCCESSFUL LOGIN
      if (response.ok && data.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken); // STORE ACCESS TOKEN
        await fetchUser(data.accessToken); // FETCH USER DETAILS
        router.push("/dashboard"); // REDIRECT TO DASHBOARD
        router.refresh(); // REFRESH THE PAGE
        toast.success("You have been logged in successfully."); // SHOW SUCCESS TOAST
      }
      return data; // RETURN RESPONSE DATA TO THE FORM
    } catch (error) {
      console.error("Login error:", error); // LOG ERROR
      throw error; // THROW ERROR FOR HANDLING IN THE UI
    }
  };

  // REGISTER FUNCTION
  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    try {
      // CALL REGISTER SERVICE
      const response = await registerService({
        name,
        email,
        password,
        confirmPassword,
      });

      const data = await response.json();
      if (response.ok) {
        router.refresh(); // REFRESH THE PAGE
        toast.info("Please check your email to verify your account."); // SHOW INFO TOAST
        return data; // RETURN RESPONSE DATA FOR SUCCESS FORM ALERT
      }
      return data; // RETURN RESPONSE DATA
    } catch (error) {
      console.error("Registration error:", error); // LOG ERROR
      throw error; // THROW ERROR FOR HANDLING IN THE UI
    }
  };

  // LOGOUT FUNCTION
  const logout = async () => {
    try {
      // CALL LOGOUT SERVICE
      const response = await logoutService();
      if (response.ok) {
        setUser(null); // CLEAR USER STATE
        sessionStorage.removeItem("accessToken"); // REMOVE ACCESS TOKEN
        router.push("/auth/login"); // REDIRECT TO LOGIN PAGE
        toast.success("You have been successfully logged out."); // SHOW SUCCESS TOAST
      } else {
        toast.error("Logout failed. Please try again."); // SHOW ERROR TOAST
      }
    } catch (error) {
      console.error("Logout error:", error); // LOG ERROR
      toast.error("Logout failed. Please try again."); // SHOW ERROR TOAST
    }
  };

  // REFRESH ACCESS TOKEN FUNCTION
  const refreshAccessToken = useCallback(async () => {
    try {
      // GET NEW ACCESS TOKEN FROM BACKEND
      const response = await refreshAccessTokenService();
      const data = await response.json();
      if (data.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken); // STORE NEW ACCESS TOKEN
        return data.accessToken; // RETURN NEW TOKEN
      }
      return null; // RETURN NULL IF TOKEN REFRESH FAILS
    } catch (error) {
      console.error("Token refresh error:", error); // LOG ERROR
      return null; // RETURN NULL IF TOKEN REFRESH FAILS
    }
  }, []);

  // HANDLE API ERRORS (E.G., 401 UNAUTHORIZED)
  const handleApiError = useCallback(
    async (error: any) => {
      if (error.response && error.response.status === 401) {
        // ATTEMPT TO REFRESH THE TOKEN AGAIN
        const newToken = await refreshAccessToken();
        if (newToken) {
          return newToken; // RETURN NEW TOKEN IF REFRESH SUCCEEDS
        } else {
          sessionStorage.removeItem("accessToken"); // REMOVE INVALID TOKEN
          setUser(null); // CLEAR USER STATE
          router.push("/login"); // REDIRECT TO LOGIN PAGE
        }
      }
      return null; // RETURN NULL IF ERROR IS NOT 401
    },
    [router, refreshAccessToken], // DEPENDENCIES
  );

  // FETCH USER DETAILS
  const fetchUser = useCallback(
    async (token?: string) => {
      if (!token) {
        setLoading(false); // STOP LOADING IF NO TOKEN
        return;
      }

      try {
        // CALL FETCH USER SERVICE
        const response = await fetchUserService(token);
        const user = await response.json();
        setUser(user); // SET USER STATE
      } catch (error: unknown) {
        const err = error as CustomError;
        if (err.response && err.response.status === 401) {
          // HANDLE 401 ERROR
          const newToken = await handleApiError({ response: err.response });
          if (newToken) {
            await fetchUser(newToken); // RETRY FETCHING USER WITH NEW TOKEN
          }
        }
        console.error("Error fetching user:", error); // LOG ERROR
      } finally {
        setLoading(false); // STOP LOADING REGARDLESS OF SUCCESS OR FAILURE
      }
    },
    [handleApiError],
  );

  // EFFECT TO INITIALIZE AUTH STATE
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      fetchUser(token); // FETCH USER DETAILS IF TOKEN EXISTS
    } else {
      setLoading(false); // STOP LOADING IF NO TOKEN
    }

    // SET UP TOKEN REFRESH INTERVAL
    const refreshTokenPeriodically = setInterval(async () => {
      const currentToken = sessionStorage.getItem("accessToken");
      if (currentToken) {
        const newToken = await refreshAccessToken(); // REFRESH TOKEN
        if (newToken) {
          await fetchUser(newToken); // FETCH USER DETAILS WITH NEW TOKEN
        }
      }
    }, Config.TOKEN_REFRESH_INTERVAL); // REFRESH INTERVAL FROM CONFIG

    // CLEANUP INTERVAL ON COMPONENT UNMOUNT
    return () => clearInterval(refreshTokenPeriodically);
  }, [fetchUser, refreshAccessToken]);

  // PROVIDE AUTH CONTEXT VALUE
  return (
    <AuthContext.Provider
      value={{
        user, // CURRENT USER
        login, // LOGIN FUNCTION
        logout, // LOGOUT FUNCTION
        refreshAccessToken, // TOKEN REFRESH FUNCTION
        register, // REGISTER FUNCTION
        loading, // LOADING STATE
        // fetchUser,
      }}
    >
      {children} {/* RENDER CHILDREN */}
    </AuthContext.Provider>
  );
}
