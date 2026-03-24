"use client";

import { useEffect, useState } from "react";
import { Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1920&auto=format&fit=crop", // Luxury aesthetic design room
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1920&auto=format&fit=crop", // Modern designer salon interior
  "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1920&auto=format&fit=crop", // Dark aesthetic beauty/spa design
];

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Delay the entrance class slightly to trigger the CSS transition
    const initTimer = setTimeout(() => setIsMounted(true), 150);
    
    const carouselTimer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000); // Change image every 5 seconds
    
    return () => {
      clearTimeout(initTimer);
      clearInterval(carouselTimer);
    };
  }, []);

  return (
    <section id="hero" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Carousel */}
      {BACKGROUND_IMAGES.map((src, index) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentImage ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="absolute inset-0 bg-stone-900/50 mix-blend-multiply z-10" />
          <img
            src={src}
            alt="HABN Studio Premium Salon"
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10 md:mt-20">
        
        <h1 
          className={cn(
            "font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-md leading-tight transform transition-all duration-1000 ease-out",
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          Where Style Meets <br className="hidden sm:block" />
          <span className="text-primary-300 italic">Sophistication</span>
        </h1>
        
        <p 
          className={cn(
            "text-lg sm:text-xl text-stone-200 max-w-2xl mx-auto mb-10 drop-shadow transform transition-all duration-1000 delay-300 ease-out",
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          Your premium destination for personalized haircuts, rejuvenating facials, 
          professional grooming & more in Maddilapalem.
        </p>
        
        <div 
          className={cn(
            "flex justify-center mt-8 transform transition-all duration-1000 delay-700 ease-out",
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <a
            href="#booking"
            className="group flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-500 transition-all text-lg shadow-[0_0_20px_rgba(239,106,76,0.4)] hover:shadow-[0_0_30px_rgba(239,106,76,0.6)]"
          >
            Book Appointment
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
