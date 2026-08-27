import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "change-this-secret-in-production-min-32-chars",
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: "owner" | "customer";
  restaurantId?: string;
}

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

// ─── Session helper (Edge-safe, no bcryptjs) ─────────────────────────────────

import { supabase } from "@/lib/supabase";

export const COOKIE_NAME = "dinely_token";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

export async function getSession(req: NextRequest): Promise<JWTPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifyToken(token);
  if (!session) return null;

  // If owner but restaurantId missing, look it up
  if (session.role === "owner" && !session.restaurantId) {
    try {
      const { data: user } = await supabase
        .from("users")
        .select("restaurant_id")
        .eq("id", session.userId)
        .single();
      if (user?.restaurant_id) {
        session.restaurantId = user.restaurant_id;
      }
    } catch {
      // Ignore lookup errors
    }
  }

  return session;
}
