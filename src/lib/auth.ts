import bcrypt from "bcryptjs";

// Re-export everything from the Edge-safe JWT module so existing imports
// like `import { getSession } from "@/lib/auth"` keep working.
export {
  signToken,
  verifyToken,
  getSession,
  COOKIE_NAME,
  COOKIE_OPTIONS,
  type JWTPayload,
} from "@/lib/jwt";

// ─── Password helpers (server-side only, NOT Edge-compatible)

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function comparePassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
