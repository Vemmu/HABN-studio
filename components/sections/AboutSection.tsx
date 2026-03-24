"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import Link from 'next/link';

export default function AboutSection() {
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
        <section id="about" ref={sectionRef} className="bg-black overflow-hidden w-full m-0 p-0">
            <div className="grid lg:grid-cols-2 min-h-[500px]">
                
                {/* Left Side - Black Background & Text */}
                <div 
                    className={cn(
                        "flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 py-16 lg:py-24 transition-all duration-1000 ease-out",
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-32"
                    )}
                >
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-5xl font-bold text-white mb-6">
                        About HABN Studio
                    </h2>
                    <p className="text-stone-300 leading-relaxed text-base sm:text-lg mb-10 max-w-xl">
                        HABN Studio offers a world-class hairdressing experience to its esteemed customers with a team of well-trained professionals in the industry. We choose the best-in-class products to ensure consistent and quality results for the services at every door. Our team of hairdressers is being trained and recruited by top-tier education teams.
                    </p>
                    <div>
                        <Link 
                            href="#" 
                            className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold text-black bg-white rounded-full hover:bg-stone-200 transition-colors shadow-sm"
                        >
                            Download Profile
                        </Link>
                    </div>
                </div>

                {/* Right Side - Premium Image */}
                <div 
                    className={cn(
                        "relative w-full h-[400px] sm:h-[500px] lg:h-auto min-h-full transition-all duration-1000 ease-out delay-300",
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-32"
                    )}
                >
                    <img 
                        src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop" 
                        alt="Luxurious Salon Interior" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>

            </div>
        </section>
    );
}
