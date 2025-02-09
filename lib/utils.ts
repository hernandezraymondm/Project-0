import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { randomBytes, createHash } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Adds a small delay to prevent timing attacks.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
export async function delayWithHash(): Promise<void> {
  return new Promise((resolve) => {
    // Generate a random string
    const randomString = randomBytes(16).toString("hex");
    // Generate a hash of the random string
    createHash("sha256").update(randomString).digest("hex");
    // Simulate delay
    setTimeout(resolve, 100);
  });
}
