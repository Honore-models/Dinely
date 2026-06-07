import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "change-this-secret-in-production-min-32-chars",
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: "owner" | "customer";
  restaurantId?: string; // only for owners
}

// ─── Password ────────────────────────────────────────────────────────────────

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function comparePassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ─── JWT ─────────────────────────────────────────────────────────────────────

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ─── Session helper ───────────────────────────────────────────────────────────
// Call this inside any API route to get the current user from the cookie.

export async function getSession(req: NextRequest): Promise<JWTPayload | null> {
  const token = req.cookies.get("dinely_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── Cookie config ────────────────────────────────────────────────────────────

export const COOKIE_NAME = "dinely_token";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  path: "/",
};
