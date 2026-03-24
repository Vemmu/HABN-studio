"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import BookingForm from "@/components/BookingForm";
import { cn } from "@/lib/utils";
import type { Branch } from "@prisma/client";

interface BookingSectionProps {
  branches: Branch[];
}

export default function BookingSection({ branches }: BookingSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
      id="booking"
      ref={sectionRef}
      className="py-16 lg:py-24 bg-white overflow-hidden"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "text-center mb-12 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <h2 className="font-display text-3xl font-bold text-stone-800 mb-4">
            Book Appointment
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Select your branch, services, date, and time. We&apos;ll confirm your booking shortly.
          </p>
        </div>
        <div
          className={cn(
            "bg-white rounded-3xl border border-stone-100 p-6 lg:p-8 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-12 scale-95"
          )}
          style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
        >
          <Suspense fallback={<div className="animate-pulse h-96 bg-stone-100 rounded-2xl" />}>
            <BookingForm branches={branches} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
