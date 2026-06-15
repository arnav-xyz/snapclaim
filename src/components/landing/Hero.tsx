"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

const trustItems = [
  "✓ No credit card",
  "✓ Free forever plan",
  "✓ Works in under 5 mins",
];

export default function Hero() {
  return (
    <section className="min-h-screen bg-[#FFFFFF] flex flex-col justify-center relative overflow-hidden pt-24">
      {/* ---- Background photo ---- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/hero-bg.jfif')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'saturate(0.7) brightness(0.95)',
          }}
        />
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(248,251,249,0.92) 40%, rgba(248,251,249,0.6) 70%, rgba(248,251,249,0.3) 100%)'
          }}
        />
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(248,251,249,0.5) 0%, transparent 30%, rgba(248,251,249,0.8) 100%)'
          }}
        />
      </div>

      {/* ---- Background radial gradient ---- */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,168,107,0.12) 0%, transparent 60%)",
        }}
      />

      {/* ---- Content ---- */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Label row */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          {...fadeUp(0)}
        >
          <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" />
          <span className="text-xs font-medium tracking-[3px] text-[#00A86B] uppercase">
            AI Photo Delivery Platform
          </span>
        </motion.div>

        {/* Main heading */}
        <div>
          <motion.div {...fadeUp(0.1)}>
            <h1 className="text-[72px] md:text-[96px] lg:text-[112px] font-bold text-[#0A1A12] leading-[0.95] tracking-[-3px] font-sans">
              Your moments,
            </h1>
          </motion.div>
          <motion.div {...fadeUp(0.2)}>
            <h1 className="text-[72px] md:text-[96px] lg:text-[112px] font-bold text-[#9ABFAD] leading-[0.95] tracking-[-3px] font-sans">
              found instantly.
            </h1>
          </motion.div>
        </div>

        {/* Subheading */}
        <motion.p
          className="mt-8 max-w-xl text-xl text-[#5A8A6E] leading-relaxed"
          {...fadeUp(0.3)}
        >
          Photographers upload all event photos. Guests scan their face. Their
          photos appear in seconds — no app, no login, no hassle.
        </motion.p>

        {/* CTA row */}
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          {...fadeUp(0.4)}
        >
          <a
            href="/register"
            className="bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] font-medium px-8 py-4 rounded-full text-base transition-all hover:scale-105 active:scale-95"
          >
            Get Started Free
          </a>
          <a
            href="#how-it-works"
            className="text-[#5A8A6E] hover:text-[#0A1A12] text-base transition-colors"
          >
            See how it works →
          </a>
        </motion.div>

        {/* Trust row */}
        <motion.div
          className="mt-12 flex flex-wrap items-center gap-6"
          {...fadeUp(0.5)}
        >
          {trustItems.map((item) => (
            <span key={item} className="text-sm text-[#4A7A5E]">
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ---- Scroll indicator ---- */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-[#00A86B]/25" />
        <ChevronDown className="w-4 h-4 text-[#00A86B]/25 animate-bounce" />
      </div>
    </section>
  );
}
