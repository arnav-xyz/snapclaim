"use client";

import { motion } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden py-28 px-6">
      {/* Background photo */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/cta-bg.jfif')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(0.6) brightness(0.7)',
          }}
        />
        <div className="absolute inset-0"
          style={{ background: 'rgba(0,168,107,0.88)' }}
        />
      </div>

      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          Ready to wow your clients?
        </h2>

        <p className="text-xl text-white/70 mt-4 max-w-2xl mx-auto">
          Join photographers already using SnapClaim to deliver moments
          instantly.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <button className="bg-white text-[#00A86B] rounded-full px-8 py-4 font-semibold hover:bg-white/90 transition-colors text-base">
            Start for free
          </button>
          <button className="text-white border border-white/40 rounded-full px-8 py-4 font-medium hover:bg-white/10 transition-colors text-base">
            See a demo →
          </button>
        </div>
      </motion.div>
    </section>
  );
}
