import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../lib/db";
import {
  hashPassword,
  comparePassword,
  signToken,
  getSession,
  COOKIE_NAME,
  COOKIE_OPTIONS,
} from "../../../../lib/auth";
import { registerSchema, loginSchema } from "../../../../lib/validators";

// ─── POST /api/auth?action=register|login|logout ──────────────────────────────
// We handle multiple actions via a query param to keep routing simple with
// the [...nextauth] catch-all pattern while not requiring NextAuth.

export async function GET(req: NextRequest) {
  // GET /api/auth → return current session user
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const db = await getDb();
    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(session.userId) },
        { projection: { passwordHash: 0 } },
      );

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user: { ...user, _id: user._id.toString() } });
  } catch (err) {
    console.error("[GET /api/auth]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "logout") {
    const res = NextResponse.json({ message: "Logged out" });
    res.cookies.set(COOKIE_NAME, "", { ...COOKIE_OPTIONS, maxAge: 0 });
    return res;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // ── Register ────────────────────────────────────────────────────────────────
  if (action === "register") {
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 422 },
      );
    }

    const { firstName, lastName, email, phone, password } = parsed.data;

    try {
      const db = await getDb();
      const existing = await db.collection("users").findOne({ email });
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 },
        );
      }

      const passwordHash = await hashPassword(password);
      const now = new Date();
      const result = await db.collection("users").insertOne({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        role: "owner",
        createdAt: now,
        updatedAt: now,
      });

      const token = await signToken({
        userId: result.insertedId.toString(),
        email,
        role: "owner",
      });

      const res = NextResponse.json(
        { message: "Account created", userId: result.insertedId.toString() },
        { status: 201 },
      );
      res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
      return res;
    } catch (err) {
      console.error("[POST /api/auth?action=register]", err);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  // ── Login ───────────────────────────────────────────────────────────────────
  if (action === "login") {
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 422 },
      );
    }

    const { email, password } = parsed.data;

    try {
      const db = await getDb();
      const user = await db.collection("users").findOne({ email });

      if (!user || !(await comparePassword(password, user.passwordHash))) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }

      const token = await signToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
      });

      const res = NextResponse.json({
        message: "Login successful",
        user: {
          _id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          restaurantId: user.restaurantId,
        },
      });
      res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
      return res;
    } catch (err) {
      console.error("[POST /api/auth?action=login]", err);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
