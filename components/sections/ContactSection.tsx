"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import MapCard from "@/components/MapCard";
import { SALON_CONTACT } from "@/lib/constants";
import type { Branch } from "@prisma/client";

interface ContactSectionProps {
  branches: Branch[];
}

export default function ContactSection({ branches }: ContactSectionProps) {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(branches[0] || null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (branches.length > 0 && !selectedBranch) {
      setSelectedBranch(branches[0]);
    }
  }, [branches, selectedBranch]);

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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "HABN Studio",
    description: "Premium salon - Multiple branches in Visakhapatnam",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Visakhapatnam",
      addressRegion: "Andhra Pradesh",
      addressCountry: "IN",
    },
    telephone: SALON_CONTACT.phone,
    email: SALON_CONTACT.email,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "18:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "139",
    },
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-16 lg:py-24 bg-stone-50 overflow-hidden"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "text-center mb-16 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <h2 className="font-display text-3xl font-bold text-stone-800 mb-4">
            Contact Us
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Visit us or get in touch at any of our branches
          </p>
        </div>

        {branches.length > 0 && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-stone-700 mb-3">Select branch</label>
            <div className="flex flex-wrap gap-2">
              {branches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBranch(b)}
                  className={cn(
                    "px-4 py-2 rounded-xl border transition-all",
                    selectedBranch?.id === b.id
                      ? "bg-primary-500 text-white border-primary-500"
                      : "bg-white border-stone-200 hover:border-primary-300 text-stone-700"
                  )}
                >
                  {b.name.replace("HABN Studio - ", "")}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {selectedBranch && (
            <div
              className={cn(
                "order-2 md:order-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              )}
              style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
            >
              <MapCard branch={selectedBranch} />
            </div>
          )}

          <div className="space-y-6 order-1 md:order-2">
            {selectedBranch && (
              <>
                <div
                  className={cn(
                    "group bg-white rounded-3xl border border-stone-100 p-6 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-700",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                  )}
                  style={{ transitionDelay: isVisible ? "180ms" : "0ms" }}
                >
                  <div className="flex gap-4">
                    <div className="p-3 bg-primary-50 rounded-2xl h-fit">
                      <MapPin size={22} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800 mb-2">Location</h3>
                      <p className="text-stone-600 text-sm leading-relaxed">{selectedBranch.address}</p>
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    "group bg-white rounded-3xl border border-stone-100 p-6 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-700",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                  )}
                  style={{ transitionDelay: isVisible ? "260ms" : "0ms" }}
                >
                  <div className="flex gap-4">
                    <div className="p-3 bg-primary-50 rounded-2xl h-fit">
                      <Phone size={22} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800 mb-2">Phone</h3>
                      <a
                        href={`tel:${(selectedBranch.phone || SALON_CONTACT.phone).replace(/\s/g, "")}`}
                        className="text-stone-600 hover:text-primary-600 text-sm transition-colors"
                      >
                        {selectedBranch.phone || SALON_CONTACT.phone}
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    "group bg-white rounded-3xl border border-stone-100 p-6 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-700",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                  )}
                  style={{ transitionDelay: isVisible ? "340ms" : "0ms" }}
                >
                  <div className="flex gap-4">
                    <div className="p-3 bg-primary-50 rounded-2xl h-fit">
                      <Mail size={22} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800 mb-2">Email</h3>
                      <a
                        href={`mailto:${selectedBranch.email || SALON_CONTACT.email}`}
                        className="text-stone-600 hover:text-primary-600 text-sm transition-colors"
                      >
                        {selectedBranch.email || SALON_CONTACT.email}
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    "group bg-white rounded-3xl border border-stone-100 p-6 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-700",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                  )}
                  style={{ transitionDelay: isVisible ? "420ms" : "0ms" }}
                >
                  <div className="flex gap-4">
                    <div className="p-3 bg-primary-50 rounded-2xl h-fit">
                      <Clock size={22} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800 mb-2">Opening Hours</h3>
                      <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                        {SALON_CONTACT.hours.weekdays}
                        {"\n"}
                        {SALON_CONTACT.hours.sunday}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
