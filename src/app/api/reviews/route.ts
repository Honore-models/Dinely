import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { createReviewSchema } from "@/lib/validators";

// ─── GET /api/reviews?restaurantId=xxx ────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get("restaurantId");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "10"));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  if (!restaurantId) {
    return NextResponse.json({ error: "restaurantId query param required" }, { status: 400 });
  }

  try {
    const { data: reviews, count, error } = await supabase
      .from("reviews")
      .select("*", { count: "exact" })
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Compute aggregate rating
    const { data: aggData } = await supabase
      .from("reviews")
      .select("rating")
      .eq("restaurant_id", restaurantId);

    const ratings = (aggData || []).map((r) => r.rating);
    const avgRating = ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : 0;

    return NextResponse.json({
      data: reviews || [],
      total: count || 0,
      page,
      limit,
      avgRating,
    });
  } catch (err) {
    console.error("[GET /api/reviews]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST /api/reviews ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
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

  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
  }

  const { restaurantId, rating, comment } = parsed.data;

  try {
    // Verify restaurant exists
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("id", restaurantId)
      .single();

    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // One review per customer per restaurant
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("restaurant_id", restaurantId)
      .eq("customer_id", session.userId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this restaurant. Use PATCH to update." },
        { status: 409 },
      );
    }

    const { data: user } = await supabase
      .from("users")
      .select("first_name, last_name")
      .eq("id", session.userId)
      .single();

    const customerName = user ? `${user.first_name} ${user.last_name}` : "Anonymous";

    const { data: newReview, error } = await supabase
      .from("reviews")
      .insert({
        restaurant_id: restaurantId,
        customer_id: session.userId,
        customer_name: customerName,
        rating,
        comment,
      })
      .select("id")
      .single();

    if (error) throw error;

    // Update restaurant's cached rating
    const { data: allReviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("restaurant_id", restaurantId);

    const ratings = (allReviews || []).map((r) => r.rating);
    if (ratings.length > 0) {
      const avgRating = Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
      await supabase
        .from("restaurants")
        .update({
          rating: avgRating,
          review_count: ratings.length,
          updated_at: new Date().toISOString(),
        })
        .eq("id", restaurantId);
    }

    return NextResponse.json(
      { message: "Review submitted", reviewId: newReview.id },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/reviews]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
