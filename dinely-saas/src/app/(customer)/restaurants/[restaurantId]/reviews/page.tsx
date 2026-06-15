"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";

const tabs = [
  { label: "Overview", href: "" },
  { label: "Menu", href: "menu" },
  { label: "Reviews", href: "reviews" },
  { label: "Photos", href: "photos" },
  { label: "Info", href: "info" },
];

export default function ReviewsPage() {
  const params = useParams();
  const id = params.restaurantId as string;
  const { user } = useAuth();
  const { reviews, total, avgRating, loading, submitReview, markHelpful } =
    useReviews(id);

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const starCounts = [5, 4, 3, 2, 1].map((s) => {
    const count = reviews.filter((r) => r.rating === s).length;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return { stars: s, count, pct };
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitReview({ rating: newRating, comment: newComment });
      setNewComment("");
      setNewRating(5);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 lg:px-8">
      {/* Tab nav */}
      <nav className="flex gap-6 overflow-x-auto border-b border-neutral-200">
        {tabs.map((tab) => {
          const href =
            tab.href === ""
              ? `/restaurants/${id}`
              : `/restaurants/${id}/${tab.href}`;
          const isActive = tab.href === "reviews";
          return (
            <Link
              key={tab.label}
              href={href}
              className={`shrink-0 pb-3 text-sm font-semibold transition ${
                isActive
                  ? "border-b-2 border-[#22c51f] text-[#22c51f]"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr]">
        {/* Rating summary */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <div className="text-center">
              <p className="text-5xl font-extrabold text-neutral-900">
                {avgRating > 0 ? avgRating.toFixed(1) : "–"}
              </p>
              <div className="mt-2 flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.round(avgRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-neutral-200"
                    }
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-neutral-500">
                Based on {total} review{total !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {starCounts.map(({ stars, count, pct }) => (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="w-4 text-right text-neutral-600">{stars}</span>
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <div className="flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-1.5 rounded-full bg-amber-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-neutral-500">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Write review */}
          {user && !submitted && (
            <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-neutral-900">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="mt-3 space-y-3">
                {submitError && (
                  <p className="text-xs text-red-500">{submitError}</p>
                )}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewRating(i + 1)}
                      className="transition hover:scale-110"
                    >
                      <Star
                        size={22}
                        className={
                          i < newRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-neutral-200"
                        }
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  required
                  className="w-full resize-none rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none placeholder:text-neutral-400 focus:border-[#22c51f] focus:ring-1 focus:ring-green-100"
                />
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="w-full rounded-xl bg-[#22c51f] py-2.5 text-sm font-bold text-white transition hover:bg-[#1bad1a] disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          )}

          {submitted && (
            <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-center text-sm font-semibold text-[#22c51f]">
              Thank you for your review! 🎉
            </div>
          )}
        </div>

        {/* Review list */}
        <div>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-neutral-100" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-neutral-100 bg-white py-12 text-center shadow-sm">
              <p className="text-sm font-semibold text-neutral-500">
                No reviews yet. Be the first to review!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const initials = review.customerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                const date = new Date(review.createdAt).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" },
                );

                return (
                  <article
                    key={review._id}
                    className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#22c51f] text-sm font-bold text-white">
                        {initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-neutral-900">
                            {review.customerName}
                          </p>
                          <p className="text-xs text-neutral-400">{date}</p>
                        </div>
                        <div className="mt-1 flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-neutral-200"
                              }
                            />
                          ))}
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                          {review.comment}
                        </p>
                        <button
                          type="button"
                          onClick={() => markHelpful(review._id)}
                          className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400 transition hover:text-neutral-600"
                        >
                          <ThumbsUp size={12} />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
