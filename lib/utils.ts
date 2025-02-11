import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Adds a small delay to prevent timing attacks.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
export async function delayWithHash(): Promise<void> {
  return new Promise(async (resolve) => {
    // Generate a random string using Web Crypto API
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const randomString = Array.from(array)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    // Generate a hash of the random string using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(randomString);
    await crypto.subtle.digest("SHA-256", data);

    // Simulate delay
    setTimeout(resolve, 100);
  });
}

/**
 * Generates a new UUID.
 *
 * @returns {string} - A newly generated UUID.
 */
export const generateUUID = (): string => {
  return uuidv4();
};

/**
 * Generates a random 6-digit verification code.
 *
 * @returns {string} - A 6-digit verification code.
 */
export const generateOTP = (): string => {
  // Generate a random 6-digit number using Web Crypto API
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return ((array[0] % 900000) + 100000).toString();
};

/**
 * Generates an expiration date for the verification token.
 *
 * @param {number} hours - The number of hours until the token expires.
 * @returns {Date} - The expiration date.
 */
export const generateExpirationDate = (hours: number): Date => {
  return new Date(new Date().getTime() + hours * 3600 * 1000);
};
