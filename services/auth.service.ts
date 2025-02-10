import { Config } from "@/config/app.config";

export const registerUser = async (values: any) => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  return response;
};

export const loginUser = async (values: any) => {
  const response = await fetch(`${Config.API_BASE_PATH}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  return response;
};
