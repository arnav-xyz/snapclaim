"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Menu, X } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Login", href: "/login" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass shadow-lg shadow-black/20 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl gradient-violet flex items-center justify-center glow-violet group-hover:scale-105 transition-transform duration-200">
                <Camera className="w-5 h-5 text-[#0A1A12]" />
              </div>
              <span
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                <span className="gradient-text-violet">Snap</span>
                <span className="text-[#0A1A12]">Claim</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-[#A0A0B0] hover:text-[#0A1A12] transition-colors duration-200 rounded-lg hover:bg-[#00A86B]/[0.12]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/register?role=photographer"
                className="px-4 py-2 text-sm font-semibold text-[#0A1A12] border border-[#2A2A3A] rounded-xl hover:border-[#6C3FC5]/60 hover:bg-[#6C3FC5]/10 transition-all duration-200"
              >
                I&apos;m a Photographer
              </Link>
              <Link
                href="/event"
                className="px-5 py-2 text-sm font-semibold text-[#0F0F13] rounded-xl gradient-gold hover:opacity-90 transition-all duration-200 glow-gold shadow-lg"
              >
                Find My Photos
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-[#A0A0B0] hover:text-[#0A1A12] hover:bg-[#00A86B]/[0.12] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[68px] left-0 right-0 z-40 glass border-t border-[#00A86B]/[0.12] shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#A0A0B0] hover:text-[#0A1A12] hover:bg-[#00A86B]/[0.12] rounded-xl transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-[#00A86B]/[0.12] mt-2 pt-3 flex flex-col gap-2">
                <Link
                  href="/register?role=photographer"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-center text-[#0A1A12] border border-[#2A2A3A] rounded-xl hover:border-[#6C3FC5]/60"
                >
                  I&apos;m a Photographer
                </Link>
                <Link
                  href="/event"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-center text-[#0F0F13] rounded-xl gradient-gold"
                >
                  Find My Photos
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
