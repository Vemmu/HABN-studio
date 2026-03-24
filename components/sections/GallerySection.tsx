"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@prisma/client";

interface GallerySectionProps {
  images: GalleryImage[];
}

export default function GallerySection({ images }: GallerySectionProps) {
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
      id="gallery"
      ref={sectionRef}
      className="py-16 lg:py-24 bg-stone-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "text-center mb-12 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
          style={{
            transitionDelay: isVisible ? "0ms" : "0ms",
          }}
        >
          <h2 className="font-display text-3xl font-bold text-stone-800 mb-4">
            Gallery
          </h2>
          <p className="text-center text-stone-600 max-w-2xl mx-auto">
            A glimpse of our work and salon ambience
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img, index) => (
            <div
              key={img.id}
              className={cn(
                "group relative aspect-square rounded-3xl overflow-hidden bg-stone-200 border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-300/30 hover:border-primary-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-12 scale-95"
              )}
              style={{
                transitionDelay: isVisible ? `${120 + index * 80}ms` : "0ms",
              }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={img.imageUrl}
                  alt={img.category || "Gallery"}
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
              </div>
              <div
                className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/10 transition-all duration-500 ease-out"
                aria-hidden
              />
              {img.category && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900/90 to-transparent text-white text-sm font-medium py-4 px-4 transition-all duration-500 group-hover:from-stone-900/95 group-hover:py-5">
                  {img.category}
                </div>
              )}
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div
            className={cn(
              "text-center py-20 text-stone-500 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <p>Gallery images coming soon. Check back later!</p>
          </div>
        )}
      </div>
    </section>
  );
}
