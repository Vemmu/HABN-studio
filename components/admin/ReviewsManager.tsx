"use client";

import { useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewsManager({
  initialReviews,
}: {
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState(initialReviews);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((r) => r.filter((x) => x.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div
          key={r.id}
          className="bg-white p-6 rounded-xl border border-stone-200 flex justify-between items-start gap-4"
        >
          <div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < r.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-stone-200"
                  }
                />
              ))}
            </div>
            <p className="text-stone-600 mb-2">&quot;{r.comment}&quot;</p>
            <p className="font-semibold text-stone-800">{r.name}</p>
            <p className="text-sm text-stone-400">
              {format(new Date(r.createdAt), "dd MMM yyyy")}
            </p>
          </div>
          <button
            onClick={() => handleDelete(r.id)}
            className="text-red-600 hover:text-red-700 p-2"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      {reviews.length === 0 && (
        <p className="text-center text-stone-500 py-12">No reviews yet</p>
      )}
    </div>
  );
}
