import { Config } from "@/config/app.config";

export const login = async (values: any) => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  return response;
};

export const register = async (values: any) => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  return response;
};

export const logout = async () => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return response;
};

export const refreshAccessToken = async () => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/refresh`, {
    method: "POST",
  });
  return response.json();
};

export const fetchUser = async (token: string) => {
  const response = await fetch(`${Config.API_BASE_PATH}/user/fetch-user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

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
