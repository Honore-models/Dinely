import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { tableSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const { data: table, error } = await supabase
      .from("restaurant_tables")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }
    return NextResponse.json({ data: table });
  } catch (err) {
    console.error("[GET /api/tables/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = tableSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
  }

  try {
    const { data: table } = await supabase
      .from("restaurant_tables")
      .select("restaurant_id")
      .eq("id", id)
      .single();

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }
    if (table.restaurant_id !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.number !== undefined) updateData.number = parsed.data.number;
    if (parsed.data.capacity !== undefined) updateData.capacity = parsed.data.capacity;
    if (parsed.data.location !== undefined) updateData.location = parsed.data.location;
    if (parsed.data.status !== undefined) updateData.status = parsed.data.status;

    const { error } = await supabase
      .from("restaurant_tables")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Table updated" });
  } catch (err) {
    console.error("[PATCH /api/tables/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: table } = await supabase
      .from("restaurant_tables")
      .select("restaurant_id")
      .eq("id", id)
      .single();

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }
    if (table.restaurant_id !== session.restaurantId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await supabase.from("restaurant_tables").delete().eq("id", id);
    return NextResponse.json({ message: "Table deleted" });
  } catch (err) {
    console.error("[DELETE /api/tables/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
