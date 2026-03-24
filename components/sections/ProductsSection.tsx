"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
}

interface ProductsSectionProps {
  products: Product[];
}

export default function ProductsSection({ products }: ProductsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (products.length === 0) return null;

  const ProductCard = ({ product, className }: { product: Product; className?: string }) => (
    <div
      className={cn(
        "flex-shrink-0 w-64 sm:w-72 group cursor-default",
        className
      )}
    >
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-500">
        <div className="aspect-square bg-stone-100 relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-display font-semibold text-stone-800 truncate">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-stone-600 mt-1 line-clamp-3 group-hover:line-clamp-none transition-all">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const productList = [...products, ...products];

  return (
    <section
      id="products"
      ref={sectionRef}
      className="py-16 lg:py-24 bg-white overflow-hidden"
    >
      <div className="mb-12 text-center">
        <div
          className={cn(
            "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <h2 className="font-display text-3xl font-bold text-stone-800 mb-4">
            Products at Our Branches
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Discover our range of quality products. Visit any branch to purchase.
          </p>
        </div>
      </div>

      <div
        className="overflow-hidden cursor-default"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex gap-6 py-4 animate-products-scroll"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {productList.map((p, i) => (
            <ProductCard key={`${p.id}-${i}`} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
