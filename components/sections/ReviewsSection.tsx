"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Review } from "@prisma/client";

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 4.9;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="py-16 lg:py-24 bg-stone-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "text-center mb-12 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <h2 className="font-display text-3xl font-bold text-stone-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-center text-stone-600 max-w-2xl mx-auto mb-8">
            See what our customers have to say about HABN Studio
          </p>
          <div
            className={cn(
              "inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-stone-100 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-4 scale-95"
            )}
            style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
          >
            <Star size={24} className="fill-primary-400 text-primary-400" />
            <span className="text-2xl font-bold text-stone-800">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-stone-500 text-sm font-medium">
              ({reviews.length} reviews)
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={cn(
                "group relative bg-white rounded-3xl border border-stone-100 p-8 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-12 scale-95"
              )}
              style={{
                transitionDelay: isVisible ? `${180 + index * 90}ms` : "0ms",
              }}
            >
              <Quote
                size={32}
                className="absolute top-6 right-6 text-primary-100 group-hover:text-primary-200 transition-colors duration-500"
                aria-hidden
              />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < review.rating
                        ? "fill-primary-400 text-primary-400"
                        : "text-stone-200"
                    }
                  />
                ))}
              </div>
              <p className="text-stone-600 text-[15px] leading-relaxed mb-6 pr-8">
                &quot;{review.comment}&quot;
              </p>
              <div className="pt-4 border-t border-stone-100">
                <p className="font-semibold text-stone-800">{review.name}</p>
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div
            className={cn(
              "text-center py-20 text-stone-500 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </section>
  );
}
