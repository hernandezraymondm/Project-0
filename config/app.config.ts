const appConfig = () => ({
  ACCESS_TOKEN_EXPIRY: "15m",
  REFRESH_TOKEN_EXPIRY: "7d",
  REFRESH_DB_SESSION_EXPIRY: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  REFRESH_COOKIE_EXPIRY: 7 * 24 * 60 * 60, // 7 days
  TOKEN_REFRESH_INTERVAL: 4 * 60 * 1000, // 4 minutes

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,

  // CURRENTLY USED
  DOMAIN: process.env.NEXT_PUBLIC_APP_URL!,
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME!,

  RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY!,

  RESEND_KEY: process.env.RESEND_API_KEY!,

  API_BASE_PATH: "/api",
});

export const Config = appConfig();
