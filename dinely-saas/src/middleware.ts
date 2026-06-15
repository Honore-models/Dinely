import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("dinely_token")?.value;

  // ── Dashboard: owners only ────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
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

  // ── Onboarding: must be logged in as owner ───────────────────────────────
  if (pathname.startsWith("/onboarding")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const session = await verifyToken(token);
    if (!session || session.role !== "owner") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ── Customer app: must be logged in ──────────────────────────────────────
  const customerProtected = [
    "/cart",
    "/checkout",
    "/orders",
    "/profile",
    "/favourites",
  ];
  if (customerProtected.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const session = await verifyToken(token);
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Owners accidentally hitting customer routes → send to dashboard
    if (session.role === "owner") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // ── Auth pages: redirect already-logged-in users away ────────────────────
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      const session = await verifyToken(token);
      if (session?.role === "owner") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      if (session?.role === "customer") {
        return NextResponse.redirect(new URL("/home", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/favourites/:path*",
    "/login",
    "/register",
  ],
};
