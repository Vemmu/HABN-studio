import Link from "next/link";
import { MapPin, Phone, Mail, Scissors, ArrowUpRight } from "lucide-react";
import { SALON_LOCATION, SALON_CONTACT } from "@/lib/constants";

const quickLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#booking", label: "Book Appointment" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#products", label: "Products" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black">
      {/* Decorative top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Brand block */}
          <div className="lg:col-span-5">
            <Link href="/#hero" className="inline-flex items-center gap-3 group mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 ring-1 ring-white/10 shadow-lg group-hover:bg-white/15 group-hover:ring-primary-500/30 group-hover:scale-105 transition-all duration-300">
                <Scissors className="w-5 h-5 text-primary-400 -rotate-45" />
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-white tracking-tight block">
                  HABN Studio
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-stone-500 font-medium">
                  Premium Salon · Visakhapatnam
                </span>
              </div>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed max-w-md">
              Your destination for haircuts, facials, grooming, and more at{" "}
              <span className="text-stone-300 font-medium">{SALON_LOCATION.address}</span>.
              Experience the best.
            </p>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-4">
            <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200 text-primary-400"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Contact
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 text-primary-400">
                  <MapPin size={16} />
                </div>
                <span className="text-sm text-stone-400">{SALON_LOCATION.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 text-primary-400">
                  <Phone size={16} />
                </div>
                <a
                  href={`tel:${SALON_CONTACT.phone.replace(/\s/g, "")}`}
                  className="text-sm text-stone-400 hover:text-white transition-colors font-medium"
                >
                  {SALON_CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-white/5 ring-1 ring-white/10 text-primary-400">
                  <Mail size={16} />
                </div>
                <a
                  href={`mailto:${SALON_CONTACT.email}`}
                  className="text-sm text-stone-400 hover:text-white transition-colors font-medium"
                >
                  {SALON_CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-800">
          <p className="text-stone-500 text-sm">
            © {new Date().getFullYear()} HABN Studio. All rights reserved.
          </p>
          <Link
            href="/#booking"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-primary-400 hover:text-white transition-all duration-300 shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5"
          >
            Book Now
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
