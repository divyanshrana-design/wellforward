import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const KEYLEN = 64;
const SALT_BYTES = 16;

/**
 * Hash a plaintext password using scrypt.
 * Returns a string in the form "salt:hash" (both hex), safe to store in the DB.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const derived = (await scryptAsync(password, salt, KEYLEN)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

/**
 * Verify a plaintext password against a stored "salt:hash" string.
 * Uses a constant-time comparison to avoid timing attacks.
 */
export async function verifyPassword(
  password: string,
  stored: string | null | undefined
): Promise<boolean> {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;

  try {
    const derived = (await scryptAsync(password, salt, KEYLEN)) as Buffer;
    const storedBuf = Buffer.from(hashHex, "hex");
    if (storedBuf.length !== derived.length) return false;
    return timingSafeEqual(derived, storedBuf);
  } catch {
    return false;
  }
}

/**
 * Lightweight password policy: at least 8 characters.
 * Returns an error message string, or null if valid.
 */
export function validatePassword(password: string): string | null {
  if (typeof password !== "string" || password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (password.length > 200) {
    return "Password is too long.";
  }
  return null;
}
