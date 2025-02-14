export const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

export const setCooldownCookie = (
  name: string,
  value: string,
  expiresInMs: number,
) => {
  if (typeof document === "undefined") return;

  const expires = new Date(Date.now() + expiresInMs).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires}`;
};
