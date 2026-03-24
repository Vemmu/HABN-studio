"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";

export default function OurVision() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section id="our-vision" ref={sectionRef} className="py-24 lg:py-32 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
                    
                    {/* Left Side - Triangular Fan Image Composition */}
                    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center lg:mt-0 mt-8 order-2 lg:order-1">
                        
                        {/* Smaller Anchor Container so they aren't 'too big' */}
                        <div className="relative w-[45%] max-w-[220px] aspect-[3/4]">

                            {/* Left Tilted Image (Animate from Left) */}
                            <div 
                                className={cn(
                                    "absolute inset-0 bg-white border-[6px] border-white shadow-xl z-10 transition-all duration-1000 ease-out origin-bottom",
                                    isVisible ? "opacity-100 -rotate-[16deg] -translate-x-24 translate-y-4 scale-95" : "opacity-0 -translate-x-48 translate-y-4 -rotate-[16deg] scale-95"
                                )}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=600&auto=format&fit=crop"
                                    alt="Barber Services"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Right Tilted Image (Animate from Right) */}
                            <div 
                                className={cn(
                                    "absolute inset-0 bg-white border-[6px] border-white shadow-xl z-10 transition-all duration-1000 ease-out delay-300 origin-bottom",
                                    isVisible ? "opacity-100 rotate-[16deg] translate-x-24 translate-y-4 scale-95" : "opacity-0 translate-x-48 translate-y-4 rotate-[16deg] scale-95"
                                )}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop"
                                    alt="Hair Styling"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Center Straight Image (Animate from Top) */}
                            <div 
                                className={cn(
                                    "absolute inset-0 bg-white border-[6px] border-white shadow-2xl z-20 transition-all duration-1000 ease-out delay-[600ms]",
                                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-32"
                                )}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1611558709798-e009c8fd7706?q=80&w=600&auto=format&fit=crop"
                                    alt="Beauty and Makeup"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Right Side - Clean Text */}
                    <div 
                        className={cn(
                            "flex flex-col justify-center max-w-xl mx-auto lg:mx-0 transition-all duration-1000 ease-out delay-700 order-1 lg:order-2",
                            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                        )}
                    >
                        <h2 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight mb-8">
                            Our Vision
                        </h2>
                        <p className="text-stone-700 leading-relaxed text-base sm:text-lg">
                            To be a customer-centric salon chain, HABN Studio warmly welcomes all customers for a world-class experience that takes them on a high level in terms of quality hair, beauty, & skin services in a hygienic, relaxed, comfortable environment to make their day fabulous.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}