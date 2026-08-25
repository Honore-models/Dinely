import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// GET /api/clients/[id]
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user profile
    const { data: userDoc } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    // Get their orders at this restaurant
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("restaurant_id", session.restaurantId)
      .eq("customer_id", id)
      .order("created_at", { ascending: false })
      .limit(20);

    return NextResponse.json({
      data: {
        user: userDoc || null,
        orders: orders || [],
      },
    });
  } catch (err) {
    console.error("[GET /api/clients/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
