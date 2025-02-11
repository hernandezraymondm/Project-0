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
    credentials: "include", //includes cookie
  });
  return response;
};

export const refreshAccessToken = async () => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/refresh`, {
    method: "POST",
  });
  return response;
};

export const fetchUser = async (token: string) => {
  const response = await fetch(`${Config.API_BASE_PATH}/user/fetch-user`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }, //includes token
  });
  return response;
};

export const verifyLink = async (target: string, token: string) => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target, token }),
  });
  return response;
};

export const verifyEmail = async (token: string, code: string) => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, code }),
  });
  return response;
};
