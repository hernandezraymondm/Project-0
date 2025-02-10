import { logActivity } from "@/app/api/logs/add-activity/route";
import { sendLockoutEmailAlert } from "../utils/mailer";
import { ActionLog } from "../enums/action-log.enum";
import bcrypt from "bcryptjs";

export const loginAttempts = new Map<
  string,
  {
    attempts: number;
    lockoutUntil?: number;
    emailSent?: boolean;
    lastAttempt: number;
  }
>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes
const ATTEMPT_RESET_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

// HANDLE FAILED LOGIN ATTEMPTS
export const handleLoginAttempts = async (
  email: string,
  password: string,
  user: any,
) => {
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    const now = Date.now();
    const userAttempts = loginAttempts.get(email) || {
      attempts: 0,
      lockoutUntil: undefined,
      emailSent: false,
      lastAttempt: now,
    };

    userAttempts.attempts += 1;
    userAttempts.lastAttempt = now;

    if (userAttempts.attempts >= MAX_ATTEMPTS) {
      userAttempts.lockoutUntil = now + LOCKOUT_DURATION;
      if (!userAttempts.emailSent) {
        console.log(`Lockout Email Sent to ${email}!`);
        await sendLockoutEmailAlert(email);
        userAttempts.emailSent = true;

        // Log activity
        logActivity(ActionLog.ACCOUNT_LOCKED, user.id, user.email);
      }
    }

    loginAttempts.set(email, userAttempts);
    return { verified: false };
  }

  loginAttempts.delete(email);
  return { verified: true };
};

// CHECK ACCOUNT LOCKOUT STATUS
export const checkLockoutStatus = (email: string) => {
  const userAttempts = loginAttempts.get(email);
  const now = Date.now();

  if (userAttempts?.lockoutUntil && userAttempts.lockoutUntil > now) {
    return {
      locked: true,
      remainingTime: Math.ceil((userAttempts.lockoutUntil - now) / 1000),
    };
  }

  return { locked: false, remainingTime: 0 };
};

// CLEANUP OLD ENTRIES
setInterval(() => {
  const now = Date.now();
  loginAttempts.forEach((value, key) => {
    if (
      value.lockoutUntil &&
      value.lockoutUntil < now &&
      now - value.lastAttempt > ATTEMPT_RESET_DURATION
    ) {
      loginAttempts.delete(key);
    }
  });
}, CLEANUP_INTERVAL);
