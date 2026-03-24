import ServiceCard from "@/components/ServiceCard";
import type { Service } from "@prisma/client";

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="py-16 lg:py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-stone-800 text-center mb-4">
          Our Services
        </h2>
        <p className="text-center text-stone-600 mb-12 max-w-2xl mx-auto">
          From haircuts to facials, we offer a complete range of salon services at competitive prices.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
        {services.length === 0 && (
          <div className="text-center py-16 text-stone-500">
            <p>No services available at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
