"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Camera, Menu, X } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Photographers", href: "#for-photographers" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll(); // check on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-white/80 border-b border-[#00A86B]/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* ---- Logo ---- */}
        <Link href="/" className="flex items-center gap-2">
          <Camera className="w-6 h-6 text-[#00A86B]" />
          <span className="text-[#0A1A12] font-semibold text-lg">SnapClaim</span>
        </Link>

        {/* ---- Center nav (hidden mobile) ---- */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[#5A8A6E] hover:text-[#0A1A12] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ---- Right actions ---- */}
        <div className="flex items-center">
          <a
            href="/login"
            className="hidden md:inline-block text-[#5A8A6E] text-sm mr-6 hover:text-[#0A1A12] transition-colors"
          >
            Log in
          </a>
          <a
            href="/register"
            className="hidden md:inline-block bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] text-sm font-medium px-5 py-2 rounded-full transition-colors"
          >
            Get Started
          </a>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden text-[#5A8A6E] hover:text-[#0A1A12] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* ---- Mobile dropdown ---- */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#00A86B]/10 bg-white/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-[#5A8A6E] hover:text-[#0A1A12] transition-colors"
              >
                {link.label}
              </a>
            ))}

            <hr className="border-[#00A86B]/[0.12]" />

            <a
              href="/login"
              className="text-sm text-[#5A8A6E] hover:text-[#0A1A12] transition-colors"
            >
              Log in
            </a>
            <a
              href="/register"
              className="text-center bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] text-sm font-medium px-5 py-2 rounded-full transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
