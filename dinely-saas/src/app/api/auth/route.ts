import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  hashPassword,
  comparePassword,
  signToken,
  getSession,
  COOKIE_NAME,
  COOKIE_OPTIONS,
} from "@/lib/auth";
import {
  registerSchema,
  loginSchema,
  customerRegisterSchema,
} from "@/lib/validators";

// ─── POST /api/auth?action=register|login|logout ──────────────────────────────

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Remove password_hash from response
    const { password_hash: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
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

  // ── Register (owner) ────────────────────────────────────────────────────────
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
      // Check existing
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 },
        );
      }

      const passwordHash = await hashPassword(password);
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          password_hash: passwordHash,
          role: "owner",
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      const token = await signToken({
        userId: newUser.id,
        email,
        role: "owner",
      });

      const res = NextResponse.json(
        { message: "Account created", userId: newUser.id },
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
      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (!user || !(await comparePassword(password, user.password_hash))) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }

      const token = await signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurant_id,
      });

      const res = NextResponse.json({
        message: "Login successful",
        user: {
          _id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          restaurantId: user.restaurant_id,
        },
      });
      res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
      return res;
    } catch (err) {
      console.error("[POST /api/auth?action=login]", err);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  // ── Register (customer) ─────────────────────────────────────────────────────
  if (action === "register-customer") {
    const parsed = customerRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 422 },
      );
    }

    const { firstName, lastName, email, phone, password } = parsed.data;

    try {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 },
        );
      }

      const passwordHash = await hashPassword(password);
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          password_hash: passwordHash,
          role: "customer",
          favourites: [],
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      const token = await signToken({
        userId: newUser.id,
        email,
        role: "customer",
      });

      const res = NextResponse.json(
        { message: "Account created", userId: newUser.id },
        { status: 201 },
      );
      res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
      return res;
    } catch (err) {
      console.error("[POST /api/auth?action=register-customer]", err);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// ─── PUT /api/auth – update own profile ──────────────────────────────────────
export async function PUT(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { updateProfileSchema } = await import("@/lib/validators");
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 422 },
    );
  }

  try {
    // Map camelCase fields to snake_case for Supabase
    const updateData: Record<string, unknown> = {};
    if (parsed.data.firstName) updateData.first_name = parsed.data.firstName;
    if (parsed.data.lastName) updateData.last_name = parsed.data.lastName;
    if (parsed.data.phone) updateData.phone = parsed.data.phone;
    if (parsed.data.address !== undefined) updateData.address = parsed.data.address;
    if (parsed.data.avatar !== undefined) updateData.avatar = parsed.data.avatar;

    await supabase
      .from("users")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", session.userId);

    const { data: updated } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.userId)
      .single();

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password_hash: _, ...safeUser } = updated;
    return NextResponse.json({ message: "Profile updated", user: safeUser });
  } catch (err) {
    console.error("[PUT /api/auth]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
