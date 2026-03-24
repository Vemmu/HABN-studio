"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#hero", label: "Home" },
  { href: "/#our-vision", label: "Vision" },
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#products", label: "Products" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // ScrollSpy logic
      const sections = navLinks.map(link => link.href.replace("/#", ""));
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) {
            current = section;
          }
        }
      }
      if (current) {
        setActiveSection(current);
      } else if (window.scrollY < 100) {
        setActiveSection("hero");
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger immediately to set initial active state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => setIsOpen(false);

  return (
    <header className="fixed top-0 w-full z-50 flex flex-col items-center">
      {/* Top Bar - Attached to background */}
      <div className="w-full bg-stone-900 border-b border-stone-800 text-stone-300 py-2.5 px-4 hidden md:flex justify-center items-center gap-10 text-xs font-medium tracking-wide">
        <div className="flex items-center gap-2 hover:text-white transition-colors">
          <Phone size={14} className="text-primary-400" />
          <a href="tel:+919876543210">+91 9876543210</a>
        </div>
        <div className="flex items-center gap-2 hover:text-white transition-colors">
          <span className="w-1 h-1 rounded-full bg-stone-700"></span>
        </div>
        <div className="flex items-center gap-2 hover:text-white transition-colors">
          <Mail size={14} className="text-primary-400" />
          <a href="mailto:info@habnstudio.com">info@habnstudio.com</a>
        </div>
      </div>

      {/* Floating Capsule Header */}
      <nav
        className={cn(
          "w-full transition-all duration-500 ease-out md:w-[95%] lg:w-[85%] max-w-6xl",
          "md:mt-6 bg-white/80 backdrop-blur-xl border border-white/50",
          "md:rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.06)] px-4 sm:px-6 lg:px-8",
          scrolled ? "md:shadow-[0_12px_48px_rgba(0,0,0,0.12)] md:bg-white/95 md:border-white/70" : ""
        )}
      >
        <div className="flex justify-between items-center h-16 lg:h-20">
          <Link
            href="/#hero"
            className="flex items-center gap-3 lg:gap-4 group"
          >
            {/* Unique Premium Logo */}
            <div className="relative flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-stone-900 shadow-md group-hover:shadow-[0_0_20px_rgba(30,30,30,0.3)] transition-all duration-300 group-hover:scale-105">
              <span className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-950 rounded-full z-0"></span>
              <Scissors className="relative z-10 w-4 h-4 text-primary-400 -rotate-45 group-hover:text-primary-300 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl lg:text-2xl font-bold tracking-tight text-stone-900 leading-none">
                HABN
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-stone-500 font-medium leading-none mt-1">
                Studio
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("/#", "");
              return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors font-medium text-sm tracking-wide relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1.5px] after:bg-primary-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left",
                  isActive ? "text-stone-950 after:scale-x-100" : "text-stone-600 hover:text-stone-950"
                )}
              >
                {link.label}
              </Link>
            )})}
            <Link
              href="/#booking"
              className="bg-stone-900 text-white px-6 py-2.5 rounded-full hover:bg-primary-600 transition-all duration-300 font-medium text-sm tracking-wide shadow-md hover:shadow-xl hover:-translate-y-0.5"
            >
              Book Now
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900 transition-colors bg-stone-100/80 rounded-full"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 w-full",
            isOpen ? "max-h-[400px] opacity-100 pb-6" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col gap-2 pt-4 border-t border-stone-200/50 px-2 mt-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("/#", "");
              return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className={cn(
                  "transition-colors font-medium p-3 rounded-xl tracking-wide text-sm",
                  isActive ? "bg-primary-50 text-primary-700 font-semibold" : "text-stone-600 hover:text-primary-600 hover:bg-primary-50"
                )}
              >
                {link.label}
              </Link>
            )})}
            <div className="flex flex-col gap-3 pt-4 border-t border-stone-100 mt-2">
              <Link
                href="/#booking"
                onClick={handleNavClick}
                className="bg-stone-900 text-white px-5 py-3.5 rounded-xl text-center font-medium shadow-md mt-2 tracking-wide"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
