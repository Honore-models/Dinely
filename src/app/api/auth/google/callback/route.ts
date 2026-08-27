import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  signToken,
  COOKIE_NAME,
  COOKIE_OPTIONS,
} from "@/lib/jwt";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

function getBaseUrl(req: NextRequest) {
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

async function exchangeCodeForTokens(
  code: string,
  redirectUri: string,
): Promise<GoogleTokenResponse> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[Google OAuth] Token exchange failed:", err);
    throw new Error("Failed to exchange authorization code");
  }

  return res.json();
}

async function getGoogleUserInfo(
  accessToken: string,
): Promise<GoogleUserInfo> {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Google user info");
  }

  return res.json();
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") || ""; // redirect path
  const error = url.searchParams.get("error");

  const baseUrl = getBaseUrl(req);

  // User denied access
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=Google+login+was+cancelled`, req.url),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=Missing+authorization+code", req.url),
    );
  }

  try {
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // 1. Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    // 2. Get user info from Google
    const googleUser = await getGoogleUserInfo(tokens.access_token);

    // 3. Find or create user in our database
    const email = googleUser.email.toLowerCase();

    // Check if user exists
    let { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!existingUser) {
      // Create new customer account
      const names = googleUser.name?.split(" ") || [];
      const firstName = googleUser.given_name || names[0] || "User";
      const lastName = googleUser.family_name || names.slice(1).join("") || "";

      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          first_name: firstName,
          last_name: lastName,
          email,
          phone: "",
          password_hash: "", // No password for Google accounts
          role: "customer",
          avatar: googleUser.picture || "",
          favourites: [],
        })
        .select("*")
        .single();

      if (insertError) {
        console.error("[Google OAuth] Failed to create user:", insertError);
        throw new Error("Failed to create account");
      }

      existingUser = newUser;
    } else if (!existingUser.password_hash && existingUser.google_id !== googleUser.sub) {
      // Update Google ID if not set
      await supabase
        .from("users")
        .update({ avatar: existingUser.avatar || googleUser.picture || "" })
        .eq("id", existingUser.id);
    }

    // 4. Create our JWT
    const token = await signToken({
      userId: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
      restaurantId: existingUser.restaurant_id || undefined,
    });

    // 5. Determine redirect destination
    let redirectTo = "/home"; // default for customers
    if (state) {
      redirectTo = state; // preserve original redirect
    } else if (existingUser.role === "owner") {
      redirectTo = "/dashboard";
    }

    // 6. Set cookie and redirect
    const response = NextResponse.redirect(new URL(redirectTo, req.url));
    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);

    return response;
  } catch (err) {
    console.error("[Google OAuth] Error:", err);
    return NextResponse.redirect(
      new URL("/login?error=Something+went+wrong+with+Google+login", req.url),
    );
  }
}
