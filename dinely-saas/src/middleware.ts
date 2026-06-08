import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Dashboard: owners only ────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("dinely_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const session = await verifyToken(token);
    if (!session || session.role !== "owner") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Inject user info as request headers so server components can read them
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", session.userId);
    requestHeaders.set("x-user-email", session.email);
    requestHeaders.set("x-restaurant-id", session.restaurantId || "");

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // ── Onboarding: must be logged in ────────────────────────────────────────
  if (pathname.startsWith("/onboarding")) {
    const token = req.cookies.get("dinely_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const session = await verifyToken(token);
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ── Auth pages: redirect logged-in users away ─────────────────────────────
  if (pathname === "/login" || pathname === "/register") {
    const token = req.cookies.get("dinely_token")?.value;
    if (token) {
      const session = await verifyToken(token);
      if (session?.role === "owner") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/login", "/register"],
};
