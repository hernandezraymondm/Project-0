import { Config } from "@/config/app.config";

export const refreshAccessToken = async () => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/refresh`, {
    method: "POST",
  });

  return response;
};

export const fetchSession = async (token: string) => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/session`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }, //includes token
  });

  return response;
};

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

export const logout = async (token: string | null) => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }, //includes accessToken
    // credentials: "include", //includes cookie
  });
  return response;
};

export const verifyLink = async (target: string, token: string) => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/verify-link`, {
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

export const resendEmail = async (email: string, captchaToken: string) => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/resend-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, captchaToken }),
  });
  return response;
};

export const resetPassword = async (email: string) => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/password-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return response;
};
