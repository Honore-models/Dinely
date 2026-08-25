import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { updateReviewSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/reviews/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
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

  const parsed = updateReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
  }

  try {
    const { data: review, error: fetchError } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    if (review.customer_id !== session.userId && session.role !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.data.rating !== undefined) updateData.rating = parsed.data.rating;
    if (parsed.data.comment !== undefined) updateData.comment = parsed.data.comment;

    const { error } = await supabase
      .from("reviews")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    // Re-compute restaurant rating
    const { data: allReviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("restaurant_id", review.restaurant_id);

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
        .eq("id", review.restaurant_id);
    }

    return NextResponse.json({ message: "Review updated" });
  } catch (err) {
    console.error("[PATCH /api/reviews/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/reviews/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: review, error: fetchError } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const isOwnerOfRestaurant =
      session.role === "owner" && review.restaurant_id === session.restaurantId;
    const isAuthor = review.customer_id === session.userId;

    if (!isOwnerOfRestaurant && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await supabase.from("reviews").delete().eq("id", id);

    // Re-compute restaurant rating
    const { data: allReviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("restaurant_id", review.restaurant_id);

    const ratings = (allReviews || []).map((r) => r.rating);
    await supabase
      .from("restaurants")
      .update({
        rating: ratings.length > 0 ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : 0,
        review_count: ratings.length,
        updated_at: new Date().toISOString(),
      })
      .eq("id", review.restaurant_id);

    return NextResponse.json({ message: "Review deleted" });
  } catch (err) {
    console.error("[DELETE /api/reviews/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/reviews/[id]?action=helpful
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const { data: review } = await supabase
      .from("reviews")
      .select("helpful")
      .eq("id", id)
      .single();

    if (!review) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await supabase
      .from("reviews")
      .update({ helpful: (review.helpful || 0) + 1 })
      .eq("id", id);

    return NextResponse.json({ message: "Marked as helpful" });
  } catch (err) {
    console.error("[POST /api/reviews/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
