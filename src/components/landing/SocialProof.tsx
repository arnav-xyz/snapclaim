"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "We shot 1,400 photos at a college fest. Every student found their photos in under a minute. The QR code at the entrance was a game changer.",
    name: "Rohan Mehta",
    initials: "RM",
    role: "Event Photographer, Pune",
  },
  {
    quote:
      "My wedding couples used to wait weeks for their album. Now they have all their candids the same evening. SnapClaim is just magic.",
    name: "Priya Nair",
    initials: "PN",
    role: "Wedding Photographer, Bangalore",
  },
  {
    quote:
      "I uploaded 800 corporate event photos and every employee found themselves without asking me once. Saved me 6 hours of sorting.",
    name: "Vikram Shah",
    initials: "VS",
    role: "Corporate Photographer, Mumbai",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function SocialProof() {
  return (
    <section className="bg-[#FFFFFF] py-20 px-6 border-t border-[#00A86B]/[0.12]">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
      >
        <motion.p
          className="text-xs font-medium tracking-[3px] text-[#00A86B] uppercase mb-4"
          variants={itemVariants}
        >
          TRUSTED BY PHOTOGRAPHERS
        </motion.p>

        <motion.h2
          className="text-4xl md:text-5xl font-bold text-[#0A1A12] tracking-tight mb-12 font-sans"
          variants={itemVariants}
        >
          Built for the real world of events.
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.initials}
              className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300"
              variants={itemVariants}
            >
              <span className="text-[#00A86B]">★★★★★</span>

              <p className="text-[#4A7A5E] text-sm leading-relaxed italic mt-4">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00A86B]/20 flex items-center justify-center text-[#00A86B] text-sm font-semibold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-[#0A1A12] text-sm font-medium">{t.name}</p>
                  <p className="text-[#5A8A6E] text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
